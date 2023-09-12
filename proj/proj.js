window.onload = function() {
  structure();
  mainpage();
}

function structure() {
  document.getElementById("signBtn").addEventListener("click", toLog);
  document.getElementById("regBtn").addEventListener("click", toReg);
  document.getElementById("submit").addEventListener("click", login);
  document.getElementById("confirm").addEventListener("click", register);
  document.getElementById("create").addEventListener("click", toReg);
  document.getElementById("back").addEventListener("click", toLog);
  document.getElementById("Classical").addEventListener("click", sortByCat);
  document.getElementById("Baroque").addEventListener("click", sortByCat);
  document.getElementById("Romantic").addEventListener("click", sortByCat);
  document.getElementById("Late 19th").addEventListener("click", sortByCat);
  document.getElementById("cartBtn").addEventListener("click", toCart);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

function login() {
  if (document.getElementById("loginName").value == "" || document.getElementById("loginPw").value == "") {
    alert("Pslease do not leave the fields empty")
  } else {
    var loginNamePw = 'name=' + document.getElementById("loginName").value + '&pw=' + document.getElementById("loginPw").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var userData = document.getElementById("userData");
        userData.innerHTML = xmlhttp.responseText;
        if (!userData.textContent) {
          document.getElementById("loginStatus").innerHTML = "<h3 class='invalid'>Invalid username or password. Please login again.</h3>";
          document.getElementById("loginName").value = document.getElementById('loginPw').value = "";
        } else {
          document.getElementById("loginPage").innerHTML = "<h3 id='welcome'>Welcome! " + userData.textContent + ". This page will close automatically in 3 seconds.</h3>";
          document.getElementById("regBtn").style = "display:none";
          sumCart(userData.textContent);
          getCart(userData.textContent);
          document.getElementById("checkRegOrLog").style = "display:none";
          document.getElementById("regFast").style = "display:none";
          document.getElementById("signBtn").style = "display:none";
          document.getElementById("logoutBtn").style = "display:inline-block";
          setTimeout(function() {
            closelogOrReg();
          }, 3000);
        }
        loginNamePw = "";
      }
    }
    xmlhttp.open("POST", "verifyLogin.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(loginNamePw);
  }
}

function fastRegister() {
  if (document.getElementById("newNamef").value == "" && document.getElementById("newPwf").value == "") {
    alert("Please Register.");
  } else {
    var regNamePw = 'name=' + document.getElementById("newNamef").value + '&pw=' + document.getElementById("newPwf").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var regStatus = document.getElementById("regStatus");
        if (xmlhttp.responseText == "created") {
          invoiceProcess();
        } else {
          document.getElementById("newNamefCheck").innerHTML = "Username duplicated!";
          document.getElementById("newNamef").value = "";
          document.getElementById("newPwf").value = "";
        }
        regNamePw = "";
      }
    }
    xmlhttp.open("POST", "create.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(regNamePw);
  }
}

function register() {
  if (document.getElementById("newName").value == "" || document.getElementById("newPw").value == "") {
    alert("Please do not leave the fields empty")
  } else {
    var regNamePw = 'name=' + document.getElementById("newName").value + '&pw=' + document.getElementById("newPw").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var regStatus = document.getElementById("regStatus");
        if (xmlhttp.responseText == "created") {
          regStatus.innerHTML = "<h3>Account created, welcome! Redirecting to login page in 3 seconds.</h3>";
          setTimeout(function() {
            toLog();
          }, 3000);
        } else {
          regStatus.innerHTML = "<h3 class='invalid'>Account already existed. Please login or choose another username.</h3>";
        }
        regNamePw = "";
      }
    }
    xmlhttp.open("POST", "create.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(regNamePw);
  }
}

function logout() {
  document.body.innerHTML = "Logging out. Redirecting to main page in 3 seconds.";
  setTimeout(function() {
    location.reload();
  }, 3000);
}

function toLog() {
  document.getElementById("regPage").style = "display:none";
  document.getElementById("loginPage").style = "display:block";
  document.getElementById("logOrReg").style = "display:block";
  document.getElementById("loginStatus").innerHTML = "";
  document.getElementById("loginName").value = document.getElementById('loginPw').value = "";
}

function toReg() {
  document.getElementById("loginPage").style = "display:none";
  document.getElementById("regPage").style = "display:block";
  document.getElementById("logOrReg").style = "display:block";
  document.getElementById("regStatus").innerHTML = "";
  document.getElementById("newName").value = document.getElementById('newPw').value = "";
}

function sortByCat() {
  resetItemStyle();
  if (event.target.id != "catLocation") {
    var cat = event.target.id;
  } else {
    var cat = event.target.textContent;
  }
  var items = document.getElementsByClassName("category");
  for (i = 0; i < items.length; i++) {
    if (items[i].getAttribute("value") != cat) {
      items[i].parentElement.style = "display:none";
    } else {
      items[i].parentElement.style = "display:block";
    }
  }
  changePage(cat);
}

function search() {
  resetItemStyle();
  var input = document.getElementById("searchBar").value.split(" ");
  var keywords = [];
  for (i = 0; i < input.length; i++) {
    if (input[i] != "") {
      keywords.push(input[i]);
    }
  }
  if (keywords == "") {
    alert("Keyword(s) cannot be empty.");
  } else {
    console.log(keywords);
    var names = document.getElementsByClassName("musicName");
    var composers = document.getElementsByClassName("composer");
    for (k = 0; k < names.length; k++) {
      names[k].parentNode.style = "display:none";
      for (j = 0; j < keywords.length; j++) {
        if (names[k].textContent.indexOf(keywords[j]) >= 0) {
          console.log("match");
          names[k].parentNode.style = "display:inline-block";
        } else if (composers[k].textContent.indexOf(keywords[j]) >= 0) {
          composers[k].parentNode.style = "display:inline-block";
        }
      }
    }
    changePage("search");
  }
}

function mainpage() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var items = document.getElementById("items");
      items.innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("POST", "items.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
}

function innerItem() {
  var target = event.target.parentElement;
  var stock = document.getElementById("stock");
  stock.style = "display:block";
  document.getElementById("items").style = "display:none";
  document.getElementById("categories").style = "display:none";
  for (k = 0; k < target.children.length; k++) {
    var clone = target.children[k].cloneNode(true);
    clone.style = "display:block";
    stock.appendChild(clone);
  }
  stock.children[3].setAttribute("autoplay", "true");
  stock.children[0].removeAttribute("onclick");
  stock.children[0].setAttribute("class", "musicName");
  stock.children[0].setAttribute("id", target.id);
  var order = document.createElement("div");
  order.setAttribute("class", "order");
  order.innerHTML = "<div>Order: </div><input type='number' min='1' id='order' value=1><div onclick='addToCart()' class='button'>Add to Cart</div>";
  stock.appendChild(order);
  changePage(target.children[0].textContent);
  window.scrollTo(0, 0);
}

function toCart() {
  resetItemStyle();
  document.getElementById("cartPage").style = "display:block";
  document.getElementById("items").style = "display:none";
  document.getElementById("categories").style = "display:none";
  document.getElementById("stock").style = "display:none";
  document.getElementById("location").style = "display:none";
  document.getElementById("itemstatus").style = "display:none";
}

function getCart(user) {
  var userid = "userid=" + user;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var getCart = document.getElementById("cartObject");
      getCart.innerHTML = xmlhttp.responseText;
      cartNumbernTotalPrice();
      checkoutOrder();
    }
  }
  xmlhttp.open("POST", "getCart.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(userid);
}

function addToCart() {
  var quantity = document.getElementById("order").value;
  var target = document.getElementById("stock");
  var cartObject = document.getElementById("cartObject");
  if (quantity < 1) {
    alert("Quantity must be at least 1.");
  } else {
    for (var i = 0; i < cartObject.children.length; i++) {
      if (cartObject.children[i].id == target.children[0].id) {
        var cartBlock = cartObject.children[i];
        var oldQuan = cartObject.children[i].children[1].getAttribute("value");
        quantity = Number(oldQuan) + Number(quantity);
        var price = Number(quantity) * Number(target.children[8].getAttribute("value"));
        cartBlock.innerHTML = "<div value='" + target.children[0].textContent + "'>Music Name: " + target.children[0].textContent + "</div><div value='" + quantity + "'>Quantity: " + quantity + "</div><div value='" + price + "'>Price: " + price + "</div><div class='button del' onclick='cartDelete()'>Delete</div>";
        break;
      }
    }
    if (i == cartObject.children.length) {
      var cartBlock = document.createElement("div");
      cartBlock.setAttribute("id", target.children[0].id);
      var price = Number(quantity) * Number(target.children[8].getAttribute("value"));
      cartBlock.innerHTML = "<div value='" + target.children[0].textContent + "'>Music Name: " + target.children[0].textContent + "</div><div value='" + quantity + "'>Quantity: " + quantity + "</div><div value='" + price + "'>Price: " + price + "</div><div class='button del' onclick='cartDelete()'>Delete</div>";
      cartObject.appendChild(cartBlock);
    }
    cartNumbernTotalPrice();
    if (document.getElementById("userData").textContent != "") {
      addToCartServer(document.getElementById("userid").textContent);
    }
    toCart();
  }
}

function cartNumbernTotalPrice() {
  var totalQuan = 0;
  var newTotalPrice = 0;
  var totalPrice = document.getElementById("totalPrice");
  var cartObject = document.getElementById("cartObject").children;
  for (i = 0; i < cartObject.length; i++) {
    totalQuan += Number(cartObject[i].children[1].getAttribute("value"));
    newTotalPrice += Number(cartObject[i].children[2].getAttribute("value"));
  }
  totalPrice.innerHTML = "Total price: $" + newTotalPrice;
  document.getElementById("cartQuan").innerHTML = totalQuan + " in cart";
}

function addToCartServer(userid) {
  var cartObject = document.getElementById("cartObject");
  for (i = 0; i < cartObject.children.length; i++) {
    var object = "userid=" + userid + "&musicid=" + cartObject.children[i].id + "&quantity=" + cartObject.children[i].children[1].getAttribute("value");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //cartObject.innerHTML = xmlhttp.responseText;
      }
    }
    xmlhttp.open("POST", "addToCart.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(object);
  }
}

function sumCart(userid) {
  var cartObject = document.getElementById("cartObject");
  for (i = 0; i < cartObject.children.length; i++) {
    var object = "userid=" + userid + "&musicid=" + cartObject.children[i].id + "&quantity=" + cartObject.children[i].children[1].getAttribute("value");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //cartObject.innerHTML = xmlhttp.responseText;
      }
    }
    xmlhttp.open("POST", "sumCart.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(object);
  }
}

function cartDelete() {
  if (document.getElementById("userData").textContent != "") {
    var requestObject = "musicid=" + event.target.parentNode.id + "&userid=" + document.getElementById("userid").textContent;
    console.log(requestObject);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "cartDelete.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(requestObject);
  }
  event.target.parentNode.remove();
  var cartObject = document.getElementById("cartObject");
  var totalPrice = document.getElementById("totalPrice");
  var newTotalPrice = 0;
  var totalQuan = 0;
  for (var k = 0; k < cartObject.children.length; k++) {
    newTotalPrice += Number(cartObject.children[k].children[2].getAttribute("value"));
    totalQuan += Number(cartObject.children[k].children[1].getAttribute("value"));
  }
  totalPrice.innerHTML = "Total price: $" + newTotalPrice;
  document.getElementById("cartQuan").innerHTML = totalQuan + " in cart";
}

function changePage(location) {
  if (location == "home") {
    document.getElementById("itemstatus").innerHTML = "All Music";
    document.getElementById("location").innerHTML = "<div id='home' onclick=changePage('home') class='button' style='display=inline-block'>Home</div>";
    document.getElementById("stock").innerHTML = "";
    document.getElementById("categories").style = "display:block";
    resetItemStyle();
  } else if (location == "Classical" || location == "Baroque" || location == "Romantic" || location == "Late 19th") {
    document.getElementById("location").innerHTML = "<div id='home' onclick=changePage('home') class='button'>Home</div><div id='arrow'> > </div><div id='catLocation' onclick=sortByCat() class='button'>" + location + "</div>";
    document.getElementById("itemstatus").innerHTML = "All " + location;
    document.getElementById("itemstatus").style = "display:block";
  } else if (location == "search") {
    document.getElementById("location").innerHTML = "<div id='home' onclick=changePage('home') class='button' style='display=inline-block'>Home</div>";
    document.getElementById("itemstatus").innerHTML = "Searching Results";
  } else {
    var arrow = document.createElement("div");
    var stock = document.createElement("div");
    arrow.innerHTML = ">";
    arrow.setAttribute("id", "arrow");
    stock.innerHTML = location;
    document.getElementById("location").appendChild(arrow);
    document.getElementById("location").appendChild(stock);
    document.getElementById("itemstatus").style = "display:none";
  }
}

function resetItemStyle() {
  var items = document.getElementById("items");
  var stock = document.getElementById("stock");
  items.style = "display:flex";
  stock.innerHTML = "";
  for (i = 0; i < items.children.length; i++) {
    items.children[i].style = "display:inline:block";
  }
  document.getElementById("itemstatus").innerHTML = "All Music";
  document.getElementById("itemstatus").style = "display:block";
  document.getElementById("categories").style = "display:block";
  document.getElementById("location").style = "display:block";
  document.getElementById("cartPage").style = "display:none";
  document.getElementById("checkoutPage").style = "display:none";
  document.getElementById("top").style = "display:block";
  document.getElementById("landing").style = "display:flex";
  document.getElementById("header").style = "display:block";
  document.getElementById("invoicePage").style = "display:none";
}

function closelogOrReg() {
  document.getElementById("logOrReg").style = "display:none";
}

function checkout() {
  document.getElementById("top").style = "display:none";
  document.getElementById("header").style = "display:none";
  document.getElementById("landing").style = "display:none";
  document.getElementById("checkoutPage").style = "display:block";
  if (document.getElementById("userData").textContent != "") {
    var userid = document.getElementById("userid").textContent;
    document.getElementById("checkRegOrLog").style = "display:none";
    document.getElementById("regFast").style = "display:none";
  } else {
    document.getElementById("checkRegOrLog").style = "display:block";
    document.getElementById("regFast").style = "display:block";
  }
  checkoutOrder();
}

function checkoutOrder() {
  var order = document.getElementById("orderList");
  order.innerHTML = "";
  var cartObject = document.getElementById("cartObject").children;
  for (i = 0; i < cartObject.length; i++) {
    var musicName = cartObject[i].children[0].getAttribute("value");
    var quantity = cartObject[i].children[1].getAttribute("value");
    var price = cartObject[i].children[2].getAttribute("value");
    var object = document.createElement("div");
    object.innerHTML = "<div>" + quantity + "  x  " + musicName + "</div><div>$" + price + "</div>";
    order.appendChild(object);
  }
  document.getElementById("checkoutTotalPrice").innerHTML = document.getElementById("totalPrice").textContent;
}

function invoice() {
  var invoicePage = document.getElementById("invoicePage");
  var checkname = document.getElementById("checkname").value;
  var company = document.getElementById("company").value;
  var a1 = document.getElementById("a1").value;
  var a2 = document.getElementById("a2").value;
  var city = document.getElementById("city").value;
  var region = document.getElementById("region").value;
  var country = document.getElementById("country").value;
  var post = document.getElementById("post").value;
  var regFast = document.getElementById("regFast");
  document.getElementById("newNamefCheck").innerHTML = "";
  if (checkname.trim() == "" || a1.trim() == "" || city.trim() == "" || country.trim() == "" || post.trim() == "") {
    alert("Please do not leave required fields empty.");
  } else if (document.getElementById("userData").textContent == "") {
    fastRegister();
  } else {
    invoiceProcess();
  }
}

function invoiceProcess() {
  var invoicePage = document.getElementById("invoicePage");
  var checkname = document.getElementById("checkname").value;
  var company = document.getElementById("company").value;
  var a1 = document.getElementById("a1").value;
  var a2 = document.getElementById("a2").value;
  var city = document.getElementById("city").value;
  var region = document.getElementById("region").value;
  var country = document.getElementById("country").value;
  var post = document.getElementById("post").value;
  var regFast = document.getElementById("regFast");
  var list = [checkname, company, a1, a2, city, region, country, post];
  for (i = 0; i < list.length; i++) {
    if (list[i] == "") {
      list[i] = "NA";
    }
  }
  document.getElementById("newNamefCheck").innerHTML = "";
  var clone1 = document.getElementById("orderList").cloneNode(true);
  var clone2 = document.getElementById("checkoutTotalPrice").cloneNode(true);
  invoicePage.innerHTML = "<h1>Invoice Page</h1><div><span>Full Name:</span> " + list[0] + "</div><div><span>Company:</span> " + list[1] + "</div><div><span>Address Line 1:</span> " + list[2] + "</div><div><span>Address Line 2:</span> " + list[3] + "</div><div><span>City:</span> " + list[4] + "</div><div><span>Region:</span> " + list[5] + "</div><div><span>Country:</span> " + list[6] + "</div><div><span>Postcode:</span> " + list[7] + "</div>";
  invoicePage.appendChild(clone1);
  invoicePage.appendChild(clone2);
  var appendix = document.createElement("div");
  appendix.innerHTML = "<div>Thanks for ordering. Your music will be delivered within 7 working days.</div><div class='button' onclick='doneInvoice()'>OK</div>";
  invoicePage.appendChild(appendix);
  document.getElementById("checkoutPage").style = "display:none";
  invoicePage.style = "display:block";
  document.getElementById("checkname").value = "";
  document.getElementById("company").value = "";
  document.getElementById("a1").value = "";
  document.getElementById("a2").value = "";
  document.getElementById("city").value = "";
  document.getElementById("region").value = "";
  document.getElementById("country").value = "";
  document.getElementById("post").value = "";
  document.getElementById("newNamef").value = "";
  document.getElementById("newPwf").value = "";
}

function doneInvoice() {
  resetItemStyle();
  document.getElementById("cartObject").innerHTML = "";
  document.getElementById("totalPrice").innerHTML = "Total price: $0";
  document.getElementById("cartQuan").innerHTML = "0 in cart";
  var userid = "userid=" + document.getElementById("userid").textContent;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

    }
  }
  xmlhttp.open("POST", "deleteCart.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(userid);
}