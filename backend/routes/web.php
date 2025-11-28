<?php

use Illuminate\Support\Facades\Route;

Route::fallback(fn() => response()->json(['error' => 'invalid endpoint'], 404));