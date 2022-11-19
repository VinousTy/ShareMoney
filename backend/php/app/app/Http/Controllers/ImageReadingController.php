<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Illuminate\Support\Facades\Log;

class ImageReadingController extends Controller
{
  public function extract(Request $request)
  {

    $client = new ImageAnnotatorClient();

    $image = $client->createImageObject(file_get_contents($request->img));

    $response = $client->textDetection($image);

    if (!is_null($response->getError())) {

      return ['result' => false];
    }

    $annotations = $response->getTextAnnotations();
    $description = str_replace('"""', '', $annotations[0]->getDescription());

    $textAnnotations = [];
    foreach ($annotations as $text) {

      //文字列の位置を取得する
      $vertices = $text->getBoundingPoly()->getVertices();

      $bounds = [];
      //文字列のX軸とY軸を$boundsへ格納
      foreach ($vertices as $vertex) {
        $bounds[] = ['x' => $vertex->getX(), 'y' => $vertex->getY()];
      }

      //各文字列とそれに対応した位置(X軸・Y軸)を$textAnnotationsへ格納
      $textAnnotations[] = [
        'description' => $text->getDescription(),
        'boundingPoly' => [
          'vertices' => $bounds
        ]
      ];
    }

    return response()->json([
      'annotations' => $textAnnotations,
      'getDescription' => $description
    ], 200);
  }
}
