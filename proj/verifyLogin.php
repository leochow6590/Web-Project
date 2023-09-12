<?php

$conn=mysqli_connect('sophia.cs.hku.hk', 'h3556661', 'wasd1679', 'h3556661') or die ('Error! '.mysqli_connect_error($conn));
$name = $_POST['name'];
$pw=$_POST['pw'];

$query = 'select * from userList';
$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
while($row = mysqli_fetch_array($result)) {
  if($row['userid']==$name && $row['pw']==$pw){
    print "<div id='userid'>".$name."</div>";
  }
}
mysqli_free_result($result);
mysqli_close($conn);

?>
