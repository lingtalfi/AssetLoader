<?php

namespace AssetLoader;

/*
 * LingTalfi 2016-01-30
 */
use AssetLoader\Exception\AssetLoaderException;

class ManifestReaderTool
{


    public static function fetchItems($manifestPath)
    {
        $ret = [];
        if (file_exists($manifestPath)) {   
            $text = file_get_contents($manifestPath);
            $items = explode(PHP_EOL . PHP_EOL, $text);
            foreach($items as $item){
                $p = explode(PHP_EOL, $item);
                $name = rtrim(array_shift($p), ':');
                $ret[$name] = $p;
            }
        }
        else {
            throw new AssetLoaderException("manifest path not found: $manifestPath");
        }
        return $ret;
    }
}
