<?php

$conn=mysqli_connect('sophia.cs.hku.hk', 'h3556661', 'wasd1679', 'h3556661') or die ('Error! '.mysqli_connect_error($conn));
$userid = $_POST['userid'];

$query = 'select cartList.musicid, musicList.musicName, musicList.price, cartList.quantity, cartList.userid from cartList INNER JOIN musicList ON cartList.musicid=musicList.musicid';
$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
while($row = mysqli_fetch_array($result)) {
  if($userid == $row['userid']){
    print "<div id='".$row['musicid']."'>";
    print "<div value='".$row['musicName']."'>Music Name: ".$row['musicName']."</div>";
    print "<div value='".$row['quantity']."'>Quantity: ".$row['quantity']."</div>";
    print "<div value='".$row['price']*$row['quantity']."'>Price: ".$row['price']*$row['quantity']."</div>";
    print "<div class='button del' onclick='cartDelete()'>Delete</div></div>";
  }
}
mysqli_free_result($result);
mysqli_close($conn);

?>
