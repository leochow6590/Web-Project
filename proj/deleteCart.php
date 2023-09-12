<?php

$conn=mysqli_connect('sophia.cs.hku.hk', 'h3556661', 'wasd1679', 'h3556661') or die ('Error! '.mysqli_connect_error($conn));
$userid = $_POST['userid'];

$query = 'DELETE FROM cartList WHERE userid="'.$userid.'"';
$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
print $query;
mysqli_free_result($result);
mysqli_close($conn);


?>
