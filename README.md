Asset Loader
=================
2016-01-30




Load assets (js/css) in your html page.


Asset Loader can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).


Features
-----------

Asset Loader has the following features:

- simple and lightweight (less than 150 lines of code)
- no dependencies
- handling of css and js files
- handling dynamic and static calls
- easy to extend for a cache system
- can read a manifest






Nomenclature
---------------

- asset: this is a js or css file.
- item: an item is a group of assets used by a module/library.
- load: to load an item is the action of injecting the item's assets into the html page.

                    
Example
----------
   
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="/libs/assetloader/js/assetloader.js"></script>
    <title>Html page</title>
</head>

<body>


<div id="blue">I've got the blues</div>

<script>
    //------------------------------------------------------------------------------/
    // FIRST REGISTER ALL YOUR LIBRARIES, that's the cost to pay...
    //------------------------------------------------------------------------------/
    assetLoader.registerItems({
        jquery: 'http://code.jquery.com/jquery-2.1.4.min.js',
        fake: [
            '/libs/assetloader/demo/fake/js/fake.js',
            '/libs/assetloader/demo/fake/css/fake.css'
        ]
    });

    //------------------------------------------------------------------------------/
    // NOW YOU CAN DYNAMICALLY INJECT ASSETS IN YOUR PAGE
    //------------------------------------------------------------------------------/
    assetLoader.loadItems(['jquery', 'fake'], function () {
        
        fake.sayHello();
        $(document).ready(function () {
            $('#blue').css('background', 'blue');
        });
    });

</script>

</body>
</html>   
```   
   
   
Methods
-----------
   
All methods are static.
   
   
You have the following js api:


### registerItem


```js
void          registerItem ( str:name, array:assets )
```

Register an item in the "asset loader" memory.

                        
### registerItems            
            
```js            
void          registerItems ( map:names2Assets )
```

Register multiple items at once, internally use the registerItem method.
names2Assets is an array of name => assets (array).
                

### setPosition                 
       
```js       
void          setPosition ( str:position=head )
```
Define where the js assets will be injected in the html page.

The css assets will always be injected into the html head.

The value can be either head or bodyEnd.

The default is head.



### getLoadedItems

```js
array         getLoadedItems ()
```
Return the map of currently loaded items names.
                        
Note: only items loaded with the asset loader, via the loadItem method will 
be detected (i.e. if you have manually injected libraries, the asset loader doesn't 
know about them).
                        
Note2: you can use the declareLoadedItem method to manually fake a loaded item.

### isLoaded              
          
```js          
bool          isLoaded ( str:name )
```
Return whether or not the item is loaded.
                
    
                        
### loadItems           

```js
void          loadItems ( str|array:items, ?callable:success )
```
Load items, then execute the success callback if defined.
The items parameter can be either an item name (string), or an array of item names.

### declareLoadedItems

```js
void          declareLoadedItems ( str|array:items )
```                        
Register the given items as loaded, directly in the memory of the asset loader.
The asset loader will then believe that those assets have been loaded.
                           

                        
                        
Using a manifest
--------------------

Since 1.1.0, there is a php helper class that we can use to read the items from a simple txt file.

The text file is called a manifest, and looks like this:

```txt
jquery:
http://code.jquery.com/jquery-2.1.4.min.js

fake:
/libs/assetloader/demo/fake/js/fake.js
/libs/assetloader/demo/fake/css/fake.css
```

The abstract notation for the manifest file would be something like this:

```abap
(
<itemName> <:> <eol>
(<asset1> <eol>) *
<eol>+
)*

```

### Example of asset loader with manifest

```php
<?php
use AssetLoader\Tool\ManifestReaderTool;

require_once "bigbang.php"; // start the local universe

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="/libs/assetloader/js/assetloader.js"></script>
    <title>Html page</title>
</head>

<body>


<div id="blue">I've got the blues</div>

<script>
    //------------------------------------------------------------------------------/
    // FIRST REGISTER ALL YOUR LIBRARIES, that's the cost to pay...
    //------------------------------------------------------------------------------/
    assetLoader.registerItems(<?php echo json_encode(ManifestReaderTool::fetchItems(__DIR__ . "/libs/assetloader/demo/service/libs.txt")); ?>);

    //------------------------------------------------------------------------------/
    // NOW YOU CAN DYNAMICALLY INJECT ASSETS IN YOUR PAGE
    //------------------------------------------------------------------------------/

    assetLoader.loadItems(['jquery', 'fake'], function () {

        fake.sayHello();
        $(document).ready(function () {
            $('#blue').css('background', 'blue');
        });
    });

</script>

</body>
</html>
```







Using the static workflow
---------------------------

Using the static worklow of the asset loader is pretty much like writing assets yourself,
but it the code necessary to do so might be more concise.
 
Here is an example of how one can use the AssetLoaderRegistry as a helper to load the assets of 
a given html page:


```php
<?php

use AssetLoader\Registry\AssetLoaderRegistry;


AssetLoaderRegistry::readManifest(__DIR__ ."/service/libs.txt"); // first call the manifest

// then define the necessary assets for your page  
AssetLoaderRegistry::useItems([  
    'jquery',
    'commonCss',
    'wozaicCss',
    'lys',
    'lysThreshold',
]);

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Html page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php AssetLoaderRegistry::writeAssets(); // now, it's just one line to write the assets, kool? ?>
    
</head>

<body>
Hi, buddy!
</body>
</html>
```
 
 



                        
                           
More about Asset loader
------------------------

There is the ["conception notes" document](https://github.com/lingtalfi/AssetLoader/blob/master/docs/conception/conception-notes.eng.txt "Asset loader conception document") which you might find helpful.





History Log
------------------
    
- 1.3.0 -- 2016-02-01

    - assetloader.js: now js items are called synchronously, in the order they are declared (in the manifest or manually) 
    
- 1.2.1 -- 2016-02-01

    - assetloader.js: fix already loaded items skip success function call, again...
    
- 1.2.0 -- 2016-01-30

    - add AssetLoaderRegistry
    - assetloader.js: fix already loaded items skip success function call... 
    - ManifestReaderTool: fix fetchItems method blanks parsing 
    
    
- 1.1.0 -- 2016-01-30

    - add ManifestReaderTool
    
- 1.0.0 -- 2016-01-30

    - initial commit
    
    