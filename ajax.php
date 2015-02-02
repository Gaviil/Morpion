<?php
session_start();

$default_json = json_encode(array(
    'user1' => array(
        'nickname'   => 'change it',
        'isComputer' => false,
        'yourTurn'   => true
    ),
    'user2' => array(
        'nickname'   => 'computer',
        'isComputer' => true,
        'yourTurn'   => false
    ),
    'grid' => array(null, null, null, null, null, null, null, null, null)
));

if(!empty($_POST['reset']))
    $_SESSION['json'] = null;

if(!empty($_POST['json']))
    $_SESSION['json'] = $_POST['json'];

print( !empty($_SESSION['json']) ? $_SESSION['json'] : $default_json );