/**
 * AssetLoader - lingtalfi - 2016-01-30
 */
(function () {
    /**
     * array of itemName => assets (array)
     */
    var items = {};
    var loadedItems = [];
    var position = 'head';


    function loadJs(url, fn) {
        var script = document.createElement("script");
        script.type = "application/javascript";
        script.src = url;
        script.onload = fn;
        script.async = true;
        if ('head' === position) {
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        }
        else if ('bodyEnd' === position) {
            document.body.appendChild(script);
        }
        else {
            devError("Invalid position: " + position);
        }
    }

    function loadCss(url, fn) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = url;
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
        fn(); // I believe we shouldn't bother waiting for onload with css
    }


    function loadItem(item, fn) {
        if (false === assetLoader.isLoaded(item)) {
            if (item in items) {
                var assets = items[item];
                var nbAssets = assets.length;


                function decrementAndFire() {
                    nbAssets--;
                    if (0 === nbAssets) {
                        fn();
                    }
                }

                for (var i in assets) {
                    var url = assets[i];
                    var ext = url.substr(url.lastIndexOf('.') + 1);
                    switch (ext) {
                        case 'js':
                            loadedItems.push(item);
                            loadJs(url, decrementAndFire);
                            break;
                        case 'css':
                            loadedItems.push(item);
                            loadCss(url, decrementAndFire);
                            break;
                        default:
                            devError("Invalid extension: " + ext);
                            break;
                    }
                }
            }
            else {
                devError("Cannot load unregistered item: " + item)
            }
        }
    }

    function devError(m) {
        console.log("assetLoader devError: " + m);
    }


    window.assetLoader = {
        registerItem: function (name, assets) {
            if ('string' === typeof assets) { // in this implementation, also accept strings as it's sometime convenient 
                assets = [assets];
            }
            items[name] = assets;
        },
        registerItems: function (names2Assets) {
            for (var name in names2Assets) {
                assetLoader.registerItem(name, names2Assets[name]);
            }
        },
        setPosition: function (pos) {
            position = pos;
        },
        getLoadedItems: function () {
            return loadedItems;
        },
        isLoaded: function (name) {
            return (-1 !== loadedItems.indexOf(name));
        },
        loadItems: function (items, success) {
            if ('string' === typeof items) {
                items = [items];
            }
            var nbItemsToLoad = items.length;

            function decrementAndFire() {
                nbItemsToLoad--;
                if (0 === nbItemsToLoad) {
                    success && success();
                }
            }

            for (var i in items) {
                loadItem(items[i], decrementAndFire);
            }
        },
        /**
         * If you have statically loaded dependencies that you know of, you
         * can declare them using this method.
         * After doing so, the asset loader would be aware of them
         */
        declareLoadedItems: function (items) {
            if ('string' === typeof items) {
                items = [items];
            }
            for (var i in items) {
                var name = items[i];
                if (false === assetLoader.isLoaded(name)) {
                    loadedItems.push(name);
                }
            }
        }
    };
})();
