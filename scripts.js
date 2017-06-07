$(document).ready(function(){
  $("td").click(function(e) {
    setOutput($(this).html());
  });
})

var operators = ["Clear", "/", "x", "-", "+", "="]
var equation = [];

function setOutput(value) {
  if (operators.indexOf(value) !== -1) { 
    //if the value is an operator
    if (equation.indexOf("=") !== -1 && value !== "Clear") { 
      //if the equation array already has an "="
      if (value !== "=") {
        $("#value").html('');
        while (equation.length !== 1) {
          equation.shift();
        }
        equation.push(value);
        $("#equation").html(equation.join(" "));
        console.log(equation);
      }
      return;
    } 
    //otherwise run the operaterPress function
    operatorPress(value);
  } else {
    if (equation.indexOf("=") !== -1) { 
      //if the equation array already has an "="
      //reset the equation and start anew
      equation = [];
      $("#value").html('');  
    }
    valuePress(value);
  }
  
}
function operatorPress(oper) {
  var value = $("#value").html();
  if (oper === "Clear")  {
    if (value === "" || equation.indexOf("=") !== -1) {
      //if value is blank, then reset the entire equation
      equation = [];
    }
    //otherwise we only want to reset the current value
    $("#value").html('');
  } else {
    if (value !== "") {
      //if there is a value, then add to equation
      equation.push(parseFloat(value));
      equation.push(oper);
      $("#equation").append(oper);
      $("#value").html('');
      if (oper === "=") {
        //if = pushed then we want to calculate the result
        calculate();
      }
    } else { 
      //else you change the operator
      equation[equation.length-1] = oper;
    } 
  }
  $("#equation").html(equation.join(" "));
  console.log(equation);
}

function valuePress(val) {
  var value = $("#value").html();
  if (value === "" && val === ".") {
    val = "0.";
  }
  $("#value").append(val);  
  $("#equation").html(equation.join(" "));
}

function calculate() {
  var bedmas = ["/","x","+","-"]; //order of operations
  var arr = equation.slice(0,-1); //copy of equation without "="
  for (var i = 0; i < bedmas.length; i++) {
    arr = arrReduce(arr, bedmas[i]);
  }
  
  arr[0] = Math.floor(arr[0]*1000)/1000; //limit to 3 decimal places
  equation.push(arr[0]);
  $("#value").html(arr[0]);  
}

function arrReduce(arr, oper) {
  /*  takes the array and operator. This function is called in a for loop that 
  will define the order of operations. This will then find the operation of interest
  in the equation array. From there is does the calculation of the values 
  +/- 1 from the operator. The function finally puts the answer in indeces x-1,
  and deletes indeces x, and x+1.
  the function will finally return an array with one final value which should be
  the correct answer.  */
  for (var x = 0; x < arr.length; x++) {
    if (arr[x] === oper) {
      switch (oper) {
        case "/":
          arr[x-1] = parseFloat(arr[x-1]) / parseFloat(arr[x+1]);
          arr.splice(x,2);
          break;
        case "x":
          arr[x-1] = parseFloat(arr[x-1]) * parseFloat(arr[x+1]);
          arr.splice(x,2);
          break;
        case "-":
          arr[x-1] = parseFloat(arr[x-1]) - parseFloat(arr[x+1]);
          arr.splice(x,2);
          break;
        case "+":
          arr[x-1] = parseFloat(arr[x-1]) + parseFloat(arr[x+1]);
          arr.splice(x,2);
          break;
      }
    }
  }
  return arr;
}