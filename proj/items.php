<?php

$conn=mysqli_connect('sophia.cs.hku.hk', 'h3556661', 'wasd1679', 'h3556661') or die ('Error! '.mysqli_connect_error($conn));

$query = 'select * from musicList';
$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
while($row = mysqli_fetch_array($result)) {
  print "<div id='".$row['musicid']."'class='block'><div class='musicName button' onclick='innerItem()'>".$row['musicName']."</div>";
  print "<img src='".$row['img']."'>";
  if($row['new'] =="Yes") {
    print "<div class='new'>New Arrival!</div>";
  }else{
    print "<div class='new'></div>";
  }
  print "<audio controls style='display:none'><source src='".$row['clip']."'></audio>";
  print "<div class='composer'>Composer: ".$row['composer']."</div>";
  print "<div class='published' style='display:none'>Published: ".$row['published']."</div>";
  print "<div class='category' style='display:none' value='".$row['category']."'>Category: ".$row['category']."</div>";
  print "<div class='description' style='display:none'>Description: ".$row['description']."</div>";
  print "<div class='price' value='".$row['price']."'>Price: $".$row['price']."</div></div>";
}

mysqli_free_result($result);
mysqli_close($conn);

?>
