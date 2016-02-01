/**
 * AssetLoader - lingtalfi - 2016-01-30
 *
 *
 * An item is an array of assets (js, css) labeled with an itemName.
 *
 * Note: for the sake of simplicity, assets and items are loaded in their order of declaration.
 *
 */
(function () {
    /**
     * map of registered items.
     *
     *          itemName => assets (array)
     */
    var items = {};
    var loadedItems = [];
    var position = 'head';

    function loadJs(url, fn) {
        var script = document.createElement("script");
        script.type = "application/javascript";
        script.src = url;
        script.onload = fn;
        //script.async = true;
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

    function devDebug(m){
        //console.log(m);
    }


    function loadItem(item, fn) {
        if (false === assetLoader.isLoaded(item)) {

            if (item in items) {
                var assets = items[item];

                function loadNextAsset() {
                    var next = assets.shift();
                    if ('undefined' !== typeof next) {
                        devDebug("-- next asset is " + next);
                        var ext = next.substr(next.lastIndexOf('.') + 1);
                        switch (ext) {
                            case 'js':
                                loadJs(next, loadNextAsset);
                                break;
                            case 'css':
                                loadCss(next, loadNextAsset);
                                break;
                            default:
                                devError("Invalid extension: " + ext);
                                break;
                        }
                    }
                    else {
                        devDebug("-- no next asset");
                        fn();
                    }
                }
                loadNextAsset();
            }
            else {
                devError("Cannot load unregistered item: " + item)
            }
        }
        else {
            fn();
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
            return this;
        },
        registerItems: function (names2Assets) {
            for (var name in names2Assets) {
                assetLoader.registerItem(name, names2Assets[name]);
            }
            return this;
        },
        setPosition: function (pos) {
            position = pos;
            return this;
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
            var itemsCopy = items.slice();

            function loadNextItem() {
                var next = itemsCopy.shift();
                if ('undefined' !== typeof next) {
                    devDebug("next item is " + next);
                    loadItem(next, loadNextItem);
                }
                else {
                    devDebug("no next item");
                    success();
                }
            }

            loadNextItem();
            return this;
        },
        /**
         *
         * If you write your assets directly in the html code,
         * then the assetLoader doesn't know about them, but their code has been called indeed,
         * so there is some kind of de-synchronization here.
         *
         * One possible problem that comes out of this de-synchronization is that if you
         * call the assetLoader.loadItems method, since the assetLoader believes that
         * the items are not loaded, it will call the assets once again.
         *
         * In order to avoid this problem, you should, whenever it makes sense to do so,
         * indicate to the assetLoader which assets/items are already in your html page;
         * so that when you call the assetLoader.loadItems method, the assetLoader will
         * act as expected.
         *
         * the declareLoadedItems method does just that: it indicates to the asset loader
         * which items are already loaded by your own means.
         *
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
            return this;
        }
    };
})();
