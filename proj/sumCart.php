<?php

$conn=mysqli_connect('sophia.cs.hku.hk', 'h3556661', 'wasd1679', 'h3556661') or die ('Error! '.mysqli_connect_error($conn));
$userid = $_POST['userid'];
$musicid = $_POST['musicid'];
$quantity = $_POST['quantity'];
$status = "notadded";

$query = 'select * from cartList';
$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
while($row = mysqli_fetch_array($result)) {
  if($row['userid']==$userid && $row["musicid"]==$musicid){
    $cartid = $row['cartid'];
    $quantity += $row['quantity'];
    $query1 = "UPDATE cartList SET quantity='$quantity' WHERE cartid=$cartid";
    $status = "added";
    if (!mysqli_query($conn, $query1)){
      echo '<p>Failed to query '.mysqli_error($conn).'</p>';
    }
  }
}
if($status=="notadded"){
  $query1 = "INSERT INTO cartList (userid, musicid, quantity) VALUE ('$userid','$musicid','$quantity')";
  if (!mysqli_query($conn, $query1)){
    echo '<p>Failed to query '.mysqli_error($conn).'</p>';
  }
}

mysqli_free_result($result);
mysqli_close($conn);

?>
