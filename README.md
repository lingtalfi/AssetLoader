Asset Loader
=================
2016-01-30




Load assets (js/css) in your html page.


Asset Loader can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).


Features
-----------

Asset Loader has the following features:

- simple and lightweight (less than 200 lines of code)
- no dependencies
- handling of css and js files
- handling dynamic and static calls
- easy to extend for a cache system
- can read a manifest file where you specify all your libraries (kool)






Nomenclature
---------------

- asset: this is a js or css file.
- item: an item is an array of assets (js, css) labeled with an itemName
- register: this is the first action to do, it's the action of defining what are the items, and what assets are they composed of
- load: once an item is registered, you can load it. To load an item is the action of dynamically injecting the item's assets into the html page
- declare: (advanced) if you have existing assets calls in your html page, you can declare them to the asset loader, so that it doesn't accidentally loads them again

                    
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

Register the item.
This is the first step: you cannot use an item without registering it.
Registering an item is simply telling the assetLoader which items you are going to use, and what assets are they composed of.

You might want to use a manifest to register all your items at once, rather than registering them manually 
one by one.
 

                        
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
Return the array of currently loaded items names.
                        
Note: only items loaded with the asset loader, via the loadItem method will 
be detected (i.e. if you have manually injected libraries, the asset loader doesn't 
know about them, in which case you should use the declareLoadedItem method to 
manually fake that they are loaded. See the declaredLoadedItems method for more details)



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
The callback is only executed when all the assets of all the given items are finished processing.



### declareLoadedItems

```js
void          declareLoadedItems ( str|array:items )
```                        
If you write your assets directly in the html code,
then the assetLoader doesn't know about them, but their code has been called indeed,
so there is some kind of de-synchronization here between what assets are really loaded, 
and what assets (items) the assetLoader thinks are loaded.

One possible problem that comes out of this de-synchronization is that if you
call the assetLoader.loadItems method, since the assetLoader believes that
the items are not loaded, it will call the assets once again.

In order to avoid this problem, you should, whenever it makes sense to do so,
indicate to the assetLoader which assets/items are already in your html page;
so that when you call the assetLoader.loadItems method, the assetLoader will
act as expected.

the declareLoadedItems method does just that: it indicates to the asset loader
which items are already loaded by your own means.
                        
                        
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


The great thing about manifest is that since 1.3.0, assets are loaded exactly in the order that you specify.
Having this simple correlation between your manifest and the way assets are loaded makes you code with 
greater confidence (I believe). 



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
 
 





History Log
------------------
     
    
    
- 1.3.2 -- 2016-02-03

    - ManifestReaderTool fix fetchItems method bad item detection again
        
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
    
    