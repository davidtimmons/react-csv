/**
 * React CSV Spreadsheet v1.1.0
 * David Timmons (github@timmons.io)
 * http://david.timmons.io
 * MIT License
 *
 * @summary An arithmetic string parser using the Shunting-Yard algorithm.
 * @module ReactCsv
 */

import './polyfills'; /// This tool requires <Array.prototype.peek()>.


 // Operations available to this arithmetic parser:
 // Index 0: Operator, Index 1: Precedence, Index 2: Operation
const OPS = {
  '(': ['(', 1, () => {}],
  ')': [')', 1, () => {}],
  '*': ['*', 3, (x, y) => x * y],
  '/': ['/', 3, (x, y) => x / y],
  '%': ['%', 3, (x, y) => x % y],
  '+': ['+', 4, (x, y) => x + y],
  '-': ['-', 4, (x, y) => x - y],
};
const BEGIN_SUB = '('; /// The beginning character of a sub-expression.
const END_SUB = ')'; /// The final character of a sub-expression.
const INVALID_RE = new RegExp('[^0-9\. ' + Object.keys(OPS).join('\\') + ']');
const ERROR_MSG = 'Invalid input!'; /// Message returned to the user upon error.


// -------------- //
// PRE-PROCESSING //
// -------------- //

/**
 * Checks whether the argument is a string of some length greater than zero.
 * @param  {string}  str='' The value to check.
 * @return {boolean}        True if the argument passes the tests.
 */
function hasStringLength(str='') {
  return (typeof str === 'string') && (str.length > 0);
}

/**
 * Checks whether the argument is a string with a leading equal sign.
 * @param  {string}  eqn='' The value to check.
 * @return {boolean}        True if the argument passes the tests.
 */
function isEquation(eqn='') {
  return hasStringLength(eqn) && (eqn.trim()[0] === '=');
}

/**
 * Removes the leading equal sign from an equation and returns a new expression.
 * @param  {string} eqn='' The equation string.
 * @return {string}        A new expression without the equal sign.
 */
function removeEqualSign(eqn='') {
  return eqn.trim().slice(1);
}

/**
 * Checks whether the argument is a valid equation with a leading equal sign,
 * no incorrect characters, and matching parenthesis.
 * @param  {string}  eqn='' The equation string.
 * @return {boolean}        True if the argument passes the tests.
 */
function isValidEquation(eqn='') {
  return isEquation(eqn) &&
         removeEqualSign(eqn).length > 0 &&
         removeEqualSign(eqn).search(INVALID_RE) === -1 &&
         0 === eqn.split('').reduce((acc, v) => {
           if (v === BEGIN_SUB) {
             return acc + 1;
           } else if (v === END_SUB) {
             return acc - 1;
           }
           return acc;
         }, 0);
}

/**
 * Removes all spaces and the leading equal sign from an equation.
 * @param  {string} eqn='' The equation string.
 * @return {string}        Normalized equation string.
 */
function normalizeExpression(eqn='') {
  return removeEqualSign(eqn).split(' ').join('');
}


// -------------- //
// PARSE EQUATION //
// -------------- //

/**
 * Returns the arguments in reversed order. This is useful for controlling the
 * order in which JavaScript processes certain operations.
 * @param  {*} ...varargs The arguments to reverse.
 * @return {*[]}          A reversed arguments array.
 */
function reverseArguments(...varargs) {
  return varargs.reverse();
}

/**
 * Find the last index of a desired operator in an operator queue.
 * Returns -1 if there is no match.
 * @param  {string} op=''  The desired operator character to match.
 * @param  {Object<string, number, function>} ops=[] The operator queue.
 * @return {number}        Index value of the last operator in the queue or -1.
 */
function findLastOperator(op='', ops=[]) {
  return ops.reduce((acc, v, i) => {
    return (v[0] === op) ? i : acc;
  }, '-1');
}

/**
 * Split an expression into operators and operands.
 * @param  {string} expr='' The equation string.
 * @return {string[]}       An array of strings representing the expression.
 */
function splitExpression(expr='') {
  var ops = Object.keys(OPS);
  return expr.split('').reduce((acc, v) => {

    // Check if this is an operator.
    if (ops.indexOf(v) > -1) {
      acc.push(v);
    }

    // Check if this character is part of a new or existing operand.
    else if (acc.length > 0 && ops.indexOf(acc.peek()) === -1) {
      acc[acc.length-1] += v;
    } else {
      acc.push(v);
    }

    return acc;
  }, []);
}

/**
 * Apply an operation to two operands.
 * @param  {Object.<string, number, function>} op The operator object.
 * @param  {string} opd2='' The second expression operand.
 * @param  {string} opd1='' The first expression operand.
 * @return {number|string}  Operation result or error message.
 */
function applyOperation(op, opd2='', opd1='') {
  return (op && opd1 && opd2) ? op[2](opd1, opd2) : ERROR_MSG;
}

/**
 * Recursively apply all operations against all operands in the queues.
 * @param  {object[]} ops  A queue of operator objects.
 * @param  {number[]} opds A queue of operands.
 * @return {number}        The final calculation result.
 */
function applyAllOperations(ops, opds) {

  // Check if there are more operations or operands to apply.
  if (opds.length <= 0) {
    return 0;
  } else if (ops.length <= 0) {
    return opds.shift();
  }

  // Recursively apply all operations in the stack. Order is important!
  return applyOperation(ops.shift(),
    ...reverseArguments(opds.shift(), applyAllOperations(ops, opds)));
}

/**
 * Populate the operator and operand stacks with the expression components.
 * @param  {string} expr='' The expression string.
 * @return {object[]}       A two-tuple array of operator, operand stacks.
 */
function populateParseStacks(expr='') {
  var ops = []; /// The operator stack.
  var opds = []; /// The operand stack.
  splitExpression(expr).reduce((acc, v) => {

    // Check if this is an operator.
    let op = OPS[v];
    if (op instanceof Array) {

      // Evaluate this sub-expression if at the end.
      if (v === END_SUB) {
        let subOps = ops.splice(1 + findLastOperator(BEGIN_SUB, ops));
        let subOpds = opds.splice(-subOps.length-1); /// Need one additional operand over ops count.
        opds.push(applyAllOperations(subOps, subOpds));
        ops.pop();
      } else if (v === BEGIN_SUB) {
        ops.push(op);
      }

      // If the previous operator has higher precedence and is not parenthesis, apply it.
      else if (ops.length > 0 && ops.peek()[0] !== BEGIN_SUB && ops.peek()[1] <= op[1]) {
        opds.push(applyOperation(ops.pop(), opds.pop(), opds.pop()));
        ops.push(op);
      } else {
        ops.push(op);
      }

    // Check if this is an operand.
    } else if (typeof parseFloat(v) === 'number') {
      opds.push(parseFloat(v));
    }
  }, true);
  return [ops, opds];
}

/**
 * Apply the Shunting-Yard algorithm to evaluate an arithmetic expression.
 * (Further Reading: https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
 * @param  {string} expr='' The arithmetic expression to evaluate.
 * @return {number|string}  Final calculation or an error message.
 */
function doShuntingYard(expr=[]) {
  return applyAllOperations(...populateParseStacks(expr));
}


// ----------- //
// ENTRY POINT //
// ----------- //

/**
 * Evaluate an arithmetic expression using the Shunting-Yard algorithm. Returns
 * an error message with bad input. Returns the original argument when it is
 * not an equation.
 * @param  {string} eqn='' The equation to evaluate.
 * @return {number|string} Final calculation, error, or the original argument.
 */
export default function parseEquation(eqn='') {
  if (isValidEquation(eqn)) {
    return doShuntingYard(normalizeExpression(eqn));
  } else if (isEquation(eqn)) {
    return removeEqualSign(eqn);
  } else {
    return eqn;
  }
}


// ----- //
// TESTS //
// ----- //

/**
 * Informal unit tests to exercise this module. Results are printed to the
 * console.
 */
function runTests() {
  var tests = [
    ['=1+1', 2],
    ['=   1 +    1   ', 2],
    ['=1-2-4', -5],
    ['=3-2*5', -7],
    ['=3*2-5', 1],
    ['=8/4*3+2', 8],
    ['=10+10', 20],
    ['= 10 * 10 / 20 % 2', 1],
    ['=(1+1)', 2],
    ['=(1+1+1)', 3],
    ['=2*7/(8-4)', 3.5],
    ['=((1-7)*2)+(2*7/(8-4))', -8.5],
    ['=((1-7)*2)+(2*7/(8-4-1-1))', -5],
    ['=(1/8%2)+3*4-8', 4.125],
    ['=13 %   9', 4],
    ['=2*(2+3)-4', 6],
    ['=2*3-4', 2],
    ['=2+3*4-5', 9],
    ['=1', 1],
    ['=(2+3', '(2+3'],
    ['=2+)3', '2+)3'],
    ['    =    ', ''],
    ['=-2', ERROR_MSG],
    ['=2(+)3', ERROR_MSG],
    ['=2+', ERROR_MSG],
  ];

  tests.forEach(v => {
    var result = parseEquation(v[0]);
    if (result !== v[1]) {
      console.log(`${v[0]},`, `result: ${result},`, 'fail');
    }
  });
}
