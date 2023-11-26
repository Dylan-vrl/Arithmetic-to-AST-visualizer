(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod3) => function __require() {
    return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
  };
  var __copyProps = (to2, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
    mod3
  ));

  // node_modules/typed-function/lib/umd/typed-function.js
  var require_typed_function = __commonJS({
    "node_modules/typed-function/lib/umd/typed-function.js"(exports, module) {
      (function(global, factory2) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory2() : typeof define === "function" && define.amd ? define(factory2) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["'typed'"] = factory2());
      })(exports, function() {
        "use strict";
        function ok() {
          return true;
        }
        function notOk() {
          return false;
        }
        function undef() {
          return void 0;
        }
        const NOT_TYPED_FUNCTION = "Argument is not a typed-function.";
        function create() {
          function isPlainObject2(x) {
            return typeof x === "object" && x !== null && x.constructor === Object;
          }
          const _types = [{
            name: "number",
            test: function(x) {
              return typeof x === "number";
            }
          }, {
            name: "string",
            test: function(x) {
              return typeof x === "string";
            }
          }, {
            name: "boolean",
            test: function(x) {
              return typeof x === "boolean";
            }
          }, {
            name: "Function",
            test: function(x) {
              return typeof x === "function";
            }
          }, {
            name: "Array",
            test: Array.isArray
          }, {
            name: "Date",
            test: function(x) {
              return x instanceof Date;
            }
          }, {
            name: "RegExp",
            test: function(x) {
              return x instanceof RegExp;
            }
          }, {
            name: "Object",
            test: isPlainObject2
          }, {
            name: "null",
            test: function(x) {
              return x === null;
            }
          }, {
            name: "undefined",
            test: function(x) {
              return x === void 0;
            }
          }];
          const anyType = {
            name: "any",
            test: ok,
            isAny: true
          };
          let typeMap;
          let typeList;
          let nConversions = 0;
          let typed3 = {
            createCount: 0
          };
          function findType(typeName) {
            const type = typeMap.get(typeName);
            if (type) {
              return type;
            }
            let message = 'Unknown type "' + typeName + '"';
            const name310 = typeName.toLowerCase();
            let otherName;
            for (otherName of typeList) {
              if (otherName.toLowerCase() === name310) {
                message += '. Did you mean "' + otherName + '" ?';
                break;
              }
            }
            throw new TypeError(message);
          }
          function addTypes(types) {
            let beforeSpec = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "any";
            const beforeIndex = beforeSpec ? findType(beforeSpec).index : typeList.length;
            const newTypes = [];
            for (let i3 = 0; i3 < types.length; ++i3) {
              if (!types[i3] || typeof types[i3].name !== "string" || typeof types[i3].test !== "function") {
                throw new TypeError("Object with properties {name: string, test: function} expected");
              }
              const typeName = types[i3].name;
              if (typeMap.has(typeName)) {
                throw new TypeError('Duplicate type name "' + typeName + '"');
              }
              newTypes.push(typeName);
              typeMap.set(typeName, {
                name: typeName,
                test: types[i3].test,
                isAny: types[i3].isAny,
                index: beforeIndex + i3,
                conversionsTo: []
                // Newly added type can't have any conversions to it
              });
            }
            const affectedTypes = typeList.slice(beforeIndex);
            typeList = typeList.slice(0, beforeIndex).concat(newTypes).concat(affectedTypes);
            for (let i3 = beforeIndex + newTypes.length; i3 < typeList.length; ++i3) {
              typeMap.get(typeList[i3]).index = i3;
            }
          }
          function clear() {
            typeMap = /* @__PURE__ */ new Map();
            typeList = [];
            nConversions = 0;
            addTypes([anyType], false);
          }
          clear();
          addTypes(_types);
          function clearConversions() {
            let typeName;
            for (typeName of typeList) {
              typeMap.get(typeName).conversionsTo = [];
            }
            nConversions = 0;
          }
          function findTypeNames(value) {
            const matches = typeList.filter((name310) => {
              const type = typeMap.get(name310);
              return !type.isAny && type.test(value);
            });
            if (matches.length) {
              return matches;
            }
            return ["any"];
          }
          function isTypedFunction(entity) {
            return entity && typeof entity === "function" && "_typedFunctionData" in entity;
          }
          function findSignature(fn, signature, options) {
            if (!isTypedFunction(fn)) {
              throw new TypeError(NOT_TYPED_FUNCTION);
            }
            const exact = options && options.exact;
            const stringSignature = Array.isArray(signature) ? signature.join(",") : signature;
            const params = parseSignature(stringSignature);
            const canonicalSignature = stringifyParams(params);
            if (!exact || canonicalSignature in fn.signatures) {
              const match = fn._typedFunctionData.signatureMap.get(canonicalSignature);
              if (match) {
                return match;
              }
            }
            const nParams = params.length;
            let remainingSignatures;
            if (exact) {
              remainingSignatures = [];
              let name310;
              for (name310 in fn.signatures) {
                remainingSignatures.push(fn._typedFunctionData.signatureMap.get(name310));
              }
            } else {
              remainingSignatures = fn._typedFunctionData.signatures;
            }
            for (let i3 = 0; i3 < nParams; ++i3) {
              const want = params[i3];
              const filteredSignatures = [];
              let possibility;
              for (possibility of remainingSignatures) {
                const have = getParamAtIndex(possibility.params, i3);
                if (!have || want.restParam && !have.restParam) {
                  continue;
                }
                if (!have.hasAny) {
                  const haveTypes = paramTypeSet(have);
                  if (want.types.some((wtype) => !haveTypes.has(wtype.name))) {
                    continue;
                  }
                }
                filteredSignatures.push(possibility);
              }
              remainingSignatures = filteredSignatures;
              if (remainingSignatures.length === 0)
                break;
            }
            let candidate;
            for (candidate of remainingSignatures) {
              if (candidate.params.length <= nParams) {
                return candidate;
              }
            }
            throw new TypeError("Signature not found (signature: " + (fn.name || "unnamed") + "(" + stringifyParams(params, ", ") + "))");
          }
          function find(fn, signature, options) {
            return findSignature(fn, signature, options).implementation;
          }
          function convert(value, typeName) {
            const type = findType(typeName);
            if (type.test(value)) {
              return value;
            }
            const conversions = type.conversionsTo;
            if (conversions.length === 0) {
              throw new Error("There are no conversions to " + typeName + " defined.");
            }
            for (let i3 = 0; i3 < conversions.length; i3++) {
              const fromType = findType(conversions[i3].from);
              if (fromType.test(value)) {
                return conversions[i3].convert(value);
              }
            }
            throw new Error("Cannot convert " + value + " to " + typeName);
          }
          function stringifyParams(params) {
            let separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ",";
            return params.map((p) => p.name).join(separator);
          }
          function parseParam(param) {
            const restParam = param.indexOf("...") === 0;
            const types = !restParam ? param : param.length > 3 ? param.slice(3) : "any";
            const typeDefs = types.split("|").map((s) => findType(s.trim()));
            let hasAny = false;
            let paramName = restParam ? "..." : "";
            const exactTypes = typeDefs.map(function(type) {
              hasAny = type.isAny || hasAny;
              paramName += type.name + "|";
              return {
                name: type.name,
                typeIndex: type.index,
                test: type.test,
                isAny: type.isAny,
                conversion: null,
                conversionIndex: -1
              };
            });
            return {
              types: exactTypes,
              name: paramName.slice(0, -1),
              // remove trailing '|' from above
              hasAny,
              hasConversion: false,
              restParam
            };
          }
          function expandParam(param) {
            const typeNames = param.types.map((t) => t.name);
            const matchingConversions = availableConversions(typeNames);
            let hasAny = param.hasAny;
            let newName = param.name;
            const convertibleTypes = matchingConversions.map(function(conversion) {
              const type = findType(conversion.from);
              hasAny = type.isAny || hasAny;
              newName += "|" + conversion.from;
              return {
                name: conversion.from,
                typeIndex: type.index,
                test: type.test,
                isAny: type.isAny,
                conversion,
                conversionIndex: conversion.index
              };
            });
            return {
              types: param.types.concat(convertibleTypes),
              name: newName,
              hasAny,
              hasConversion: convertibleTypes.length > 0,
              restParam: param.restParam
            };
          }
          function paramTypeSet(param) {
            if (!param.typeSet) {
              param.typeSet = /* @__PURE__ */ new Set();
              param.types.forEach((type) => param.typeSet.add(type.name));
            }
            return param.typeSet;
          }
          function parseSignature(rawSignature) {
            const params = [];
            if (typeof rawSignature !== "string") {
              throw new TypeError("Signatures must be strings");
            }
            const signature = rawSignature.trim();
            if (signature === "") {
              return params;
            }
            const rawParams = signature.split(",");
            for (let i3 = 0; i3 < rawParams.length; ++i3) {
              const parsedParam = parseParam(rawParams[i3].trim());
              if (parsedParam.restParam && i3 !== rawParams.length - 1) {
                throw new SyntaxError('Unexpected rest parameter "' + rawParams[i3] + '": only allowed for the last parameter');
              }
              if (parsedParam.types.length === 0) {
                return null;
              }
              params.push(parsedParam);
            }
            return params;
          }
          function hasRestParam(params) {
            const param = last(params);
            return param ? param.restParam : false;
          }
          function compileTest(param) {
            if (!param || param.types.length === 0) {
              return ok;
            } else if (param.types.length === 1) {
              return findType(param.types[0].name).test;
            } else if (param.types.length === 2) {
              const test0 = findType(param.types[0].name).test;
              const test1 = findType(param.types[1].name).test;
              return function or2(x) {
                return test0(x) || test1(x);
              };
            } else {
              const tests = param.types.map(function(type) {
                return findType(type.name).test;
              });
              return function or2(x) {
                for (let i3 = 0; i3 < tests.length; i3++) {
                  if (tests[i3](x)) {
                    return true;
                  }
                }
                return false;
              };
            }
          }
          function compileTests(params) {
            let tests, test0, test1;
            if (hasRestParam(params)) {
              tests = initial(params).map(compileTest);
              const varIndex = tests.length;
              const lastTest = compileTest(last(params));
              const testRestParam = function(args) {
                for (let i3 = varIndex; i3 < args.length; i3++) {
                  if (!lastTest(args[i3])) {
                    return false;
                  }
                }
                return true;
              };
              return function testArgs(args) {
                for (let i3 = 0; i3 < tests.length; i3++) {
                  if (!tests[i3](args[i3])) {
                    return false;
                  }
                }
                return testRestParam(args) && args.length >= varIndex + 1;
              };
            } else {
              if (params.length === 0) {
                return function testArgs(args) {
                  return args.length === 0;
                };
              } else if (params.length === 1) {
                test0 = compileTest(params[0]);
                return function testArgs(args) {
                  return test0(args[0]) && args.length === 1;
                };
              } else if (params.length === 2) {
                test0 = compileTest(params[0]);
                test1 = compileTest(params[1]);
                return function testArgs(args) {
                  return test0(args[0]) && test1(args[1]) && args.length === 2;
                };
              } else {
                tests = params.map(compileTest);
                return function testArgs(args) {
                  for (let i3 = 0; i3 < tests.length; i3++) {
                    if (!tests[i3](args[i3])) {
                      return false;
                    }
                  }
                  return args.length === tests.length;
                };
              }
            }
          }
          function getParamAtIndex(params, index2) {
            return index2 < params.length ? params[index2] : hasRestParam(params) ? last(params) : null;
          }
          function getTypeSetAtIndex(params, index2) {
            const param = getParamAtIndex(params, index2);
            if (!param) {
              return /* @__PURE__ */ new Set();
            }
            return paramTypeSet(param);
          }
          function isExactType(type) {
            return type.conversion === null || type.conversion === void 0;
          }
          function mergeExpectedParams(signatures, index2) {
            const typeSet = /* @__PURE__ */ new Set();
            signatures.forEach((signature) => {
              const paramSet = getTypeSetAtIndex(signature.params, index2);
              let name310;
              for (name310 of paramSet) {
                typeSet.add(name310);
              }
            });
            return typeSet.has("any") ? ["any"] : Array.from(typeSet);
          }
          function createError(name310, args, signatures) {
            let err, expected;
            const _name = name310 || "unnamed";
            let matchingSignatures = signatures;
            let index2;
            for (index2 = 0; index2 < args.length; index2++) {
              const nextMatchingDefs = [];
              matchingSignatures.forEach((signature) => {
                const param = getParamAtIndex(signature.params, index2);
                const test = compileTest(param);
                if ((index2 < signature.params.length || hasRestParam(signature.params)) && test(args[index2])) {
                  nextMatchingDefs.push(signature);
                }
              });
              if (nextMatchingDefs.length === 0) {
                expected = mergeExpectedParams(matchingSignatures, index2);
                if (expected.length > 0) {
                  const actualTypes = findTypeNames(args[index2]);
                  err = new TypeError("Unexpected type of argument in function " + _name + " (expected: " + expected.join(" or ") + ", actual: " + actualTypes.join(" | ") + ", index: " + index2 + ")");
                  err.data = {
                    category: "wrongType",
                    fn: _name,
                    index: index2,
                    actual: actualTypes,
                    expected
                  };
                  return err;
                }
              } else {
                matchingSignatures = nextMatchingDefs;
              }
            }
            const lengths = matchingSignatures.map(function(signature) {
              return hasRestParam(signature.params) ? Infinity : signature.params.length;
            });
            if (args.length < Math.min.apply(null, lengths)) {
              expected = mergeExpectedParams(matchingSignatures, index2);
              err = new TypeError("Too few arguments in function " + _name + " (expected: " + expected.join(" or ") + ", index: " + args.length + ")");
              err.data = {
                category: "tooFewArgs",
                fn: _name,
                index: args.length,
                expected
              };
              return err;
            }
            const maxLength = Math.max.apply(null, lengths);
            if (args.length > maxLength) {
              err = new TypeError("Too many arguments in function " + _name + " (expected: " + maxLength + ", actual: " + args.length + ")");
              err.data = {
                category: "tooManyArgs",
                fn: _name,
                index: args.length,
                expectedLength: maxLength
              };
              return err;
            }
            const argTypes = [];
            for (let i3 = 0; i3 < args.length; ++i3) {
              argTypes.push(findTypeNames(args[i3]).join("|"));
            }
            err = new TypeError('Arguments of type "' + argTypes.join(", ") + '" do not match any of the defined signatures of function ' + _name + ".");
            err.data = {
              category: "mismatch",
              actual: argTypes
            };
            return err;
          }
          function getLowestTypeIndex(param) {
            let min3 = typeList.length + 1;
            for (let i3 = 0; i3 < param.types.length; i3++) {
              if (isExactType(param.types[i3])) {
                min3 = Math.min(min3, param.types[i3].typeIndex);
              }
            }
            return min3;
          }
          function getLowestConversionIndex(param) {
            let min3 = nConversions + 1;
            for (let i3 = 0; i3 < param.types.length; i3++) {
              if (!isExactType(param.types[i3])) {
                min3 = Math.min(min3, param.types[i3].conversionIndex);
              }
            }
            return min3;
          }
          function compareParams(param1, param2) {
            if (param1.hasAny) {
              if (!param2.hasAny) {
                return 1;
              }
            } else if (param2.hasAny) {
              return -1;
            }
            if (param1.restParam) {
              if (!param2.restParam) {
                return 1;
              }
            } else if (param2.restParam) {
              return -1;
            }
            if (param1.hasConversion) {
              if (!param2.hasConversion) {
                return 1;
              }
            } else if (param2.hasConversion) {
              return -1;
            }
            const typeDiff = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);
            if (typeDiff < 0) {
              return -1;
            }
            if (typeDiff > 0) {
              return 1;
            }
            const convDiff = getLowestConversionIndex(param1) - getLowestConversionIndex(param2);
            if (convDiff < 0) {
              return -1;
            }
            if (convDiff > 0) {
              return 1;
            }
            return 0;
          }
          function compareSignatures(signature1, signature2) {
            const pars1 = signature1.params;
            const pars2 = signature2.params;
            const last1 = last(pars1);
            const last2 = last(pars2);
            const hasRest1 = hasRestParam(pars1);
            const hasRest2 = hasRestParam(pars2);
            if (hasRest1 && last1.hasAny) {
              if (!hasRest2 || !last2.hasAny) {
                return 1;
              }
            } else if (hasRest2 && last2.hasAny) {
              return -1;
            }
            let any1 = 0;
            let conv1 = 0;
            let par;
            for (par of pars1) {
              if (par.hasAny)
                ++any1;
              if (par.hasConversion)
                ++conv1;
            }
            let any2 = 0;
            let conv2 = 0;
            for (par of pars2) {
              if (par.hasAny)
                ++any2;
              if (par.hasConversion)
                ++conv2;
            }
            if (any1 !== any2) {
              return any1 - any2;
            }
            if (hasRest1 && last1.hasConversion) {
              if (!hasRest2 || !last2.hasConversion) {
                return 1;
              }
            } else if (hasRest2 && last2.hasConversion) {
              return -1;
            }
            if (conv1 !== conv2) {
              return conv1 - conv2;
            }
            if (hasRest1) {
              if (!hasRest2) {
                return 1;
              }
            } else if (hasRest2) {
              return -1;
            }
            const lengthCriterion = (pars1.length - pars2.length) * (hasRest1 ? -1 : 1);
            if (lengthCriterion !== 0) {
              return lengthCriterion;
            }
            const comparisons = [];
            let tc = 0;
            for (let i3 = 0; i3 < pars1.length; ++i3) {
              const thisComparison = compareParams(pars1[i3], pars2[i3]);
              comparisons.push(thisComparison);
              tc += thisComparison;
            }
            if (tc !== 0) {
              return tc;
            }
            let c;
            for (c of comparisons) {
              if (c !== 0) {
                return c;
              }
            }
            return 0;
          }
          function availableConversions(typeNames) {
            if (typeNames.length === 0) {
              return [];
            }
            const types = typeNames.map(findType);
            if (typeNames.length > 1) {
              types.sort((t1, t2) => t1.index - t2.index);
            }
            let matches = types[0].conversionsTo;
            if (typeNames.length === 1) {
              return matches;
            }
            matches = matches.concat([]);
            const knownTypes = new Set(typeNames);
            for (let i3 = 1; i3 < types.length; ++i3) {
              let newMatch;
              for (newMatch of types[i3].conversionsTo) {
                if (!knownTypes.has(newMatch.from)) {
                  matches.push(newMatch);
                  knownTypes.add(newMatch.from);
                }
              }
            }
            return matches;
          }
          function compileArgsPreprocessing(params, fn) {
            let fnConvert = fn;
            if (params.some((p) => p.hasConversion)) {
              const restParam = hasRestParam(params);
              const compiledConversions = params.map(compileArgConversion);
              fnConvert = function convertArgs() {
                const args = [];
                const last2 = restParam ? arguments.length - 1 : arguments.length;
                for (let i3 = 0; i3 < last2; i3++) {
                  args[i3] = compiledConversions[i3](arguments[i3]);
                }
                if (restParam) {
                  args[last2] = arguments[last2].map(compiledConversions[last2]);
                }
                return fn.apply(this, args);
              };
            }
            let fnPreprocess = fnConvert;
            if (hasRestParam(params)) {
              const offset = params.length - 1;
              fnPreprocess = function preprocessRestParams() {
                return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
              };
            }
            return fnPreprocess;
          }
          function compileArgConversion(param) {
            let test0, test1, conversion0, conversion1;
            const tests = [];
            const conversions = [];
            param.types.forEach(function(type) {
              if (type.conversion) {
                tests.push(findType(type.conversion.from).test);
                conversions.push(type.conversion.convert);
              }
            });
            switch (conversions.length) {
              case 0:
                return function convertArg(arg2) {
                  return arg2;
                };
              case 1:
                test0 = tests[0];
                conversion0 = conversions[0];
                return function convertArg(arg2) {
                  if (test0(arg2)) {
                    return conversion0(arg2);
                  }
                  return arg2;
                };
              case 2:
                test0 = tests[0];
                test1 = tests[1];
                conversion0 = conversions[0];
                conversion1 = conversions[1];
                return function convertArg(arg2) {
                  if (test0(arg2)) {
                    return conversion0(arg2);
                  }
                  if (test1(arg2)) {
                    return conversion1(arg2);
                  }
                  return arg2;
                };
              default:
                return function convertArg(arg2) {
                  for (let i3 = 0; i3 < conversions.length; i3++) {
                    if (tests[i3](arg2)) {
                      return conversions[i3](arg2);
                    }
                  }
                  return arg2;
                };
            }
          }
          function splitParams(params) {
            function _splitParams(params2, index2, paramsSoFar) {
              if (index2 < params2.length) {
                const param = params2[index2];
                let resultingParams = [];
                if (param.restParam) {
                  const exactTypes = param.types.filter(isExactType);
                  if (exactTypes.length < param.types.length) {
                    resultingParams.push({
                      types: exactTypes,
                      name: "..." + exactTypes.map((t) => t.name).join("|"),
                      hasAny: exactTypes.some((t) => t.isAny),
                      hasConversion: false,
                      restParam: true
                    });
                  }
                  resultingParams.push(param);
                } else {
                  resultingParams = param.types.map(function(type) {
                    return {
                      types: [type],
                      name: type.name,
                      hasAny: type.isAny,
                      hasConversion: type.conversion,
                      restParam: false
                    };
                  });
                }
                return flatMap(resultingParams, function(nextParam) {
                  return _splitParams(params2, index2 + 1, paramsSoFar.concat([nextParam]));
                });
              } else {
                return [paramsSoFar];
              }
            }
            return _splitParams(params, 0, []);
          }
          function conflicting(params1, params2) {
            const ii = Math.max(params1.length, params2.length);
            for (let i3 = 0; i3 < ii; i3++) {
              const typeSet1 = getTypeSetAtIndex(params1, i3);
              const typeSet2 = getTypeSetAtIndex(params2, i3);
              let overlap = false;
              let name310;
              for (name310 of typeSet2) {
                if (typeSet1.has(name310)) {
                  overlap = true;
                  break;
                }
              }
              if (!overlap) {
                return false;
              }
            }
            const len1 = params1.length;
            const len2 = params2.length;
            const restParam1 = hasRestParam(params1);
            const restParam2 = hasRestParam(params2);
            return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
          }
          function clearResolutions(functionList) {
            return functionList.map((fn) => {
              if (isReferToSelf(fn)) {
                return referToSelf(fn.referToSelf.callback);
              }
              if (isReferTo(fn)) {
                return makeReferTo(fn.referTo.references, fn.referTo.callback);
              }
              return fn;
            });
          }
          function collectResolutions(references, functionList, signatureMap) {
            const resolvedReferences = [];
            let reference;
            for (reference of references) {
              let resolution = signatureMap[reference];
              if (typeof resolution !== "number") {
                throw new TypeError('No definition for referenced signature "' + reference + '"');
              }
              resolution = functionList[resolution];
              if (typeof resolution !== "function") {
                return false;
              }
              resolvedReferences.push(resolution);
            }
            return resolvedReferences;
          }
          function resolveReferences(functionList, signatureMap, self2) {
            const resolvedFunctions = clearResolutions(functionList);
            const isResolved = new Array(resolvedFunctions.length).fill(false);
            let leftUnresolved = true;
            while (leftUnresolved) {
              leftUnresolved = false;
              let nothingResolved = true;
              for (let i3 = 0; i3 < resolvedFunctions.length; ++i3) {
                if (isResolved[i3])
                  continue;
                const fn = resolvedFunctions[i3];
                if (isReferToSelf(fn)) {
                  resolvedFunctions[i3] = fn.referToSelf.callback(self2);
                  resolvedFunctions[i3].referToSelf = fn.referToSelf;
                  isResolved[i3] = true;
                  nothingResolved = false;
                } else if (isReferTo(fn)) {
                  const resolvedReferences = collectResolutions(fn.referTo.references, resolvedFunctions, signatureMap);
                  if (resolvedReferences) {
                    resolvedFunctions[i3] = fn.referTo.callback.apply(this, resolvedReferences);
                    resolvedFunctions[i3].referTo = fn.referTo;
                    isResolved[i3] = true;
                    nothingResolved = false;
                  } else {
                    leftUnresolved = true;
                  }
                }
              }
              if (nothingResolved && leftUnresolved) {
                throw new SyntaxError("Circular reference detected in resolving typed.referTo");
              }
            }
            return resolvedFunctions;
          }
          function validateDeprecatedThis(signaturesMap) {
            const deprecatedThisRegex = /\bthis(\(|\.signatures\b)/;
            Object.keys(signaturesMap).forEach((signature) => {
              const fn = signaturesMap[signature];
              if (deprecatedThisRegex.test(fn.toString())) {
                throw new SyntaxError("Using `this` to self-reference a function is deprecated since typed-function@3. Use typed.referTo and typed.referToSelf instead.");
              }
            });
          }
          function createTypedFunction(name310, rawSignaturesMap) {
            typed3.createCount++;
            if (Object.keys(rawSignaturesMap).length === 0) {
              throw new SyntaxError("No signatures provided");
            }
            if (typed3.warnAgainstDeprecatedThis) {
              validateDeprecatedThis(rawSignaturesMap);
            }
            const parsedParams = [];
            const originalFunctions = [];
            const signaturesMap = {};
            const preliminarySignatures = [];
            let signature;
            for (signature in rawSignaturesMap) {
              if (!Object.prototype.hasOwnProperty.call(rawSignaturesMap, signature)) {
                continue;
              }
              const params = parseSignature(signature);
              if (!params)
                continue;
              parsedParams.forEach(function(pp) {
                if (conflicting(pp, params)) {
                  throw new TypeError('Conflicting signatures "' + stringifyParams(pp) + '" and "' + stringifyParams(params) + '".');
                }
              });
              parsedParams.push(params);
              const functionIndex = originalFunctions.length;
              originalFunctions.push(rawSignaturesMap[signature]);
              const conversionParams = params.map(expandParam);
              let sp;
              for (sp of splitParams(conversionParams)) {
                const spName = stringifyParams(sp);
                preliminarySignatures.push({
                  params: sp,
                  name: spName,
                  fn: functionIndex
                });
                if (sp.every((p) => !p.hasConversion)) {
                  signaturesMap[spName] = functionIndex;
                }
              }
            }
            preliminarySignatures.sort(compareSignatures);
            const resolvedFunctions = resolveReferences(originalFunctions, signaturesMap, theTypedFn);
            let s;
            for (s in signaturesMap) {
              if (Object.prototype.hasOwnProperty.call(signaturesMap, s)) {
                signaturesMap[s] = resolvedFunctions[signaturesMap[s]];
              }
            }
            const signatures = [];
            const internalSignatureMap = /* @__PURE__ */ new Map();
            for (s of preliminarySignatures) {
              if (!internalSignatureMap.has(s.name)) {
                s.fn = resolvedFunctions[s.fn];
                signatures.push(s);
                internalSignatureMap.set(s.name, s);
              }
            }
            const ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
            const ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
            const ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
            const ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
            const ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
            const ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
            const allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5;
            for (let i3 = 0; i3 < signatures.length; ++i3) {
              signatures[i3].test = compileTests(signatures[i3].params);
            }
            const test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
            const test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
            const test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
            const test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
            const test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
            const test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
            const test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
            const test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
            const test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
            const test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
            const test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
            const test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk;
            for (let i3 = 0; i3 < signatures.length; ++i3) {
              signatures[i3].implementation = compileArgsPreprocessing(signatures[i3].params, signatures[i3].fn);
            }
            const fn0 = ok0 ? signatures[0].implementation : undef;
            const fn1 = ok1 ? signatures[1].implementation : undef;
            const fn2 = ok2 ? signatures[2].implementation : undef;
            const fn3 = ok3 ? signatures[3].implementation : undef;
            const fn4 = ok4 ? signatures[4].implementation : undef;
            const fn5 = ok5 ? signatures[5].implementation : undef;
            const len0 = ok0 ? signatures[0].params.length : -1;
            const len1 = ok1 ? signatures[1].params.length : -1;
            const len2 = ok2 ? signatures[2].params.length : -1;
            const len3 = ok3 ? signatures[3].params.length : -1;
            const len4 = ok4 ? signatures[4].params.length : -1;
            const len5 = ok5 ? signatures[5].params.length : -1;
            const iStart = allOk ? 6 : 0;
            const iEnd = signatures.length;
            const tests = signatures.map((s2) => s2.test);
            const fns = signatures.map((s2) => s2.implementation);
            const generic = function generic2() {
              for (let i3 = iStart; i3 < iEnd; i3++) {
                if (tests[i3](arguments)) {
                  return fns[i3].apply(this, arguments);
                }
              }
              return typed3.onMismatch(name310, arguments, signatures);
            };
            function theTypedFn(arg0, arg1) {
              if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
                return fn0.apply(this, arguments);
              }
              if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
                return fn1.apply(this, arguments);
              }
              if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
                return fn2.apply(this, arguments);
              }
              if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
                return fn3.apply(this, arguments);
              }
              if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
                return fn4.apply(this, arguments);
              }
              if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
                return fn5.apply(this, arguments);
              }
              return generic.apply(this, arguments);
            }
            try {
              Object.defineProperty(theTypedFn, "name", {
                value: name310
              });
            } catch (err) {
            }
            theTypedFn.signatures = signaturesMap;
            theTypedFn._typedFunctionData = {
              signatures,
              signatureMap: internalSignatureMap
            };
            return theTypedFn;
          }
          function _onMismatch(name310, args, signatures) {
            throw createError(name310, args, signatures);
          }
          function initial(arr) {
            return slice(arr, 0, arr.length - 1);
          }
          function last(arr) {
            return arr[arr.length - 1];
          }
          function slice(arr, start, end) {
            return Array.prototype.slice.call(arr, start, end);
          }
          function findInArray(arr, test) {
            for (let i3 = 0; i3 < arr.length; i3++) {
              if (test(arr[i3])) {
                return arr[i3];
              }
            }
            return void 0;
          }
          function flatMap(arr, callback) {
            return Array.prototype.concat.apply([], arr.map(callback));
          }
          function referTo() {
            const references = initial(arguments).map((s) => stringifyParams(parseSignature(s)));
            const callback = last(arguments);
            if (typeof callback !== "function") {
              throw new TypeError("Callback function expected as last argument");
            }
            return makeReferTo(references, callback);
          }
          function makeReferTo(references, callback) {
            return {
              referTo: {
                references,
                callback
              }
            };
          }
          function referToSelf(callback) {
            if (typeof callback !== "function") {
              throw new TypeError("Callback function expected as first argument");
            }
            return {
              referToSelf: {
                callback
              }
            };
          }
          function isReferTo(objectOrFn) {
            return objectOrFn && typeof objectOrFn.referTo === "object" && Array.isArray(objectOrFn.referTo.references) && typeof objectOrFn.referTo.callback === "function";
          }
          function isReferToSelf(objectOrFn) {
            return objectOrFn && typeof objectOrFn.referToSelf === "object" && typeof objectOrFn.referToSelf.callback === "function";
          }
          function checkName(nameSoFar, newName) {
            if (!nameSoFar) {
              return newName;
            }
            if (newName && newName !== nameSoFar) {
              const err = new Error("Function names do not match (expected: " + nameSoFar + ", actual: " + newName + ")");
              err.data = {
                actual: newName,
                expected: nameSoFar
              };
              throw err;
            }
            return nameSoFar;
          }
          function getObjectName(obj) {
            let name310;
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key) && (isTypedFunction(obj[key]) || typeof obj[key].signature === "string")) {
                name310 = checkName(name310, obj[key].name);
              }
            }
            return name310;
          }
          function mergeSignatures(dest, source) {
            let key;
            for (key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (key in dest) {
                  if (source[key] !== dest[key]) {
                    const err = new Error('Signature "' + key + '" is defined twice');
                    err.data = {
                      signature: key,
                      sourceFunction: source[key],
                      destFunction: dest[key]
                    };
                    throw err;
                  }
                }
                dest[key] = source[key];
              }
            }
          }
          const saveTyped = typed3;
          typed3 = function(maybeName) {
            const named = typeof maybeName === "string";
            const start = named ? 1 : 0;
            let name310 = named ? maybeName : "";
            const allSignatures = {};
            for (let i3 = start; i3 < arguments.length; ++i3) {
              const item = arguments[i3];
              let theseSignatures = {};
              let thisName;
              if (typeof item === "function") {
                thisName = item.name;
                if (typeof item.signature === "string") {
                  theseSignatures[item.signature] = item;
                } else if (isTypedFunction(item)) {
                  theseSignatures = item.signatures;
                }
              } else if (isPlainObject2(item)) {
                theseSignatures = item;
                if (!named) {
                  thisName = getObjectName(item);
                }
              }
              if (Object.keys(theseSignatures).length === 0) {
                const err = new TypeError("Argument to 'typed' at index " + i3 + " is not a (typed) function, nor an object with signatures as keys and functions as values.");
                err.data = {
                  index: i3,
                  argument: item
                };
                throw err;
              }
              if (!named) {
                name310 = checkName(name310, thisName);
              }
              mergeSignatures(allSignatures, theseSignatures);
            }
            return createTypedFunction(name310 || "", allSignatures);
          };
          typed3.create = create;
          typed3.createCount = saveTyped.createCount;
          typed3.onMismatch = _onMismatch;
          typed3.throwMismatchError = _onMismatch;
          typed3.createError = createError;
          typed3.clear = clear;
          typed3.clearConversions = clearConversions;
          typed3.addTypes = addTypes;
          typed3._findType = findType;
          typed3.referTo = referTo;
          typed3.referToSelf = referToSelf;
          typed3.convert = convert;
          typed3.findSignature = findSignature;
          typed3.find = find;
          typed3.isTypedFunction = isTypedFunction;
          typed3.warnAgainstDeprecatedThis = true;
          typed3.addType = function(type, beforeObjectTest) {
            let before = "any";
            if (beforeObjectTest !== false && typeMap.has("Object")) {
              before = "Object";
            }
            typed3.addTypes([type], before);
          };
          function _validateConversion(conversion) {
            if (!conversion || typeof conversion.from !== "string" || typeof conversion.to !== "string" || typeof conversion.convert !== "function") {
              throw new TypeError("Object with properties {from: string, to: string, convert: function} expected");
            }
            if (conversion.to === conversion.from) {
              throw new SyntaxError('Illegal to define conversion from "' + conversion.from + '" to itself.');
            }
          }
          typed3.addConversion = function(conversion) {
            _validateConversion(conversion);
            const to2 = findType(conversion.to);
            if (to2.conversionsTo.every(function(other) {
              return other.from !== conversion.from;
            })) {
              to2.conversionsTo.push({
                from: conversion.from,
                convert: conversion.convert,
                index: nConversions++
              });
            } else {
              throw new Error('There is already a conversion from "' + conversion.from + '" to "' + to2.name + '"');
            }
          };
          typed3.addConversions = function(conversions) {
            conversions.forEach(typed3.addConversion);
          };
          typed3.removeConversion = function(conversion) {
            _validateConversion(conversion);
            const to2 = findType(conversion.to);
            const existingConversion = findInArray(to2.conversionsTo, (c) => c.from === conversion.from);
            if (!existingConversion) {
              throw new Error("Attempt to remove nonexistent conversion from " + conversion.from + " to " + conversion.to);
            }
            if (existingConversion.convert !== conversion.convert) {
              throw new Error("Conversion to remove does not match existing conversion");
            }
            const index2 = to2.conversionsTo.indexOf(existingConversion);
            to2.conversionsTo.splice(index2, 1);
          };
          typed3.resolve = function(tf, argList) {
            if (!isTypedFunction(tf)) {
              throw new TypeError(NOT_TYPED_FUNCTION);
            }
            const sigs = tf._typedFunctionData.signatures;
            for (let i3 = 0; i3 < sigs.length; ++i3) {
              if (sigs[i3].test(argList)) {
                return sigs[i3];
              }
            }
            return null;
          };
          return typed3;
        }
        var typedFunction2 = create();
        return typedFunction2;
      });
    }
  });

  // node_modules/complex.js/complex.js
  var require_complex = __commonJS({
    "node_modules/complex.js/complex.js"(exports, module) {
      (function(root) {
        "use strict";
        var cosh4 = Math.cosh || function(x) {
          return Math.abs(x) < 1e-9 ? 1 - x : (Math.exp(x) + Math.exp(-x)) * 0.5;
        };
        var sinh4 = Math.sinh || function(x) {
          return Math.abs(x) < 1e-9 ? x : (Math.exp(x) - Math.exp(-x)) * 0.5;
        };
        var cosm1 = function(x) {
          var b = Math.PI / 4;
          if (-b > x || x > b) {
            return Math.cos(x) - 1;
          }
          var xx = x * x;
          return xx * (xx * (xx * (xx * (xx * (xx * (xx * (xx / 20922789888e3 - 1 / 87178291200) + 1 / 479001600) - 1 / 3628800) + 1 / 40320) - 1 / 720) + 1 / 24) - 1 / 2);
        };
        var hypot3 = function(x, y2) {
          var a = Math.abs(x);
          var b = Math.abs(y2);
          if (a < 3e3 && b < 3e3) {
            return Math.sqrt(a * a + b * b);
          }
          if (a < b) {
            a = b;
            b = x / y2;
          } else {
            b = y2 / x;
          }
          return a * Math.sqrt(1 + b * b);
        };
        var parser_exit = function() {
          throw SyntaxError("Invalid Param");
        };
        function logHypot(a, b) {
          var _a = Math.abs(a);
          var _b = Math.abs(b);
          if (a === 0) {
            return Math.log(_b);
          }
          if (b === 0) {
            return Math.log(_a);
          }
          if (_a < 3e3 && _b < 3e3) {
            return Math.log(a * a + b * b) * 0.5;
          }
          a = a / 2;
          b = b / 2;
          return 0.5 * Math.log(a * a + b * b) + Math.LN2;
        }
        var parse2 = function(a, b) {
          var z = { "re": 0, "im": 0 };
          if (a === void 0 || a === null) {
            z["re"] = z["im"] = 0;
          } else if (b !== void 0) {
            z["re"] = a;
            z["im"] = b;
          } else
            switch (typeof a) {
              case "object":
                if ("im" in a && "re" in a) {
                  z["re"] = a["re"];
                  z["im"] = a["im"];
                } else if ("abs" in a && "arg" in a) {
                  if (!Number.isFinite(a["abs"]) && Number.isFinite(a["arg"])) {
                    return Complex3["INFINITY"];
                  }
                  z["re"] = a["abs"] * Math.cos(a["arg"]);
                  z["im"] = a["abs"] * Math.sin(a["arg"]);
                } else if ("r" in a && "phi" in a) {
                  if (!Number.isFinite(a["r"]) && Number.isFinite(a["phi"])) {
                    return Complex3["INFINITY"];
                  }
                  z["re"] = a["r"] * Math.cos(a["phi"]);
                  z["im"] = a["r"] * Math.sin(a["phi"]);
                } else if (a.length === 2) {
                  z["re"] = a[0];
                  z["im"] = a[1];
                } else {
                  parser_exit();
                }
                break;
              case "string":
                z["im"] = /* void */
                z["re"] = 0;
                var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
                var plus = 1;
                var minus = 0;
                if (tokens === null) {
                  parser_exit();
                }
                for (var i3 = 0; i3 < tokens.length; i3++) {
                  var c = tokens[i3];
                  if (c === " " || c === "	" || c === "\n") {
                  } else if (c === "+") {
                    plus++;
                  } else if (c === "-") {
                    minus++;
                  } else if (c === "i" || c === "I") {
                    if (plus + minus === 0) {
                      parser_exit();
                    }
                    if (tokens[i3 + 1] !== " " && !isNaN(tokens[i3 + 1])) {
                      z["im"] += parseFloat((minus % 2 ? "-" : "") + tokens[i3 + 1]);
                      i3++;
                    } else {
                      z["im"] += parseFloat((minus % 2 ? "-" : "") + "1");
                    }
                    plus = minus = 0;
                  } else {
                    if (plus + minus === 0 || isNaN(c)) {
                      parser_exit();
                    }
                    if (tokens[i3 + 1] === "i" || tokens[i3 + 1] === "I") {
                      z["im"] += parseFloat((minus % 2 ? "-" : "") + c);
                      i3++;
                    } else {
                      z["re"] += parseFloat((minus % 2 ? "-" : "") + c);
                    }
                    plus = minus = 0;
                  }
                }
                if (plus + minus > 0) {
                  parser_exit();
                }
                break;
              case "number":
                z["im"] = 0;
                z["re"] = a;
                break;
              default:
                parser_exit();
            }
          if (isNaN(z["re"]) || isNaN(z["im"])) {
          }
          return z;
        };
        function Complex3(a, b) {
          if (!(this instanceof Complex3)) {
            return new Complex3(a, b);
          }
          var z = parse2(a, b);
          this["re"] = z["re"];
          this["im"] = z["im"];
        }
        Complex3.prototype = {
          "re": 0,
          "im": 0,
          /**
           * Calculates the sign of a complex number, which is a normalized complex
           *
           * @returns {Complex}
           */
          "sign": function() {
            var abs3 = this["abs"]();
            return new Complex3(
              this["re"] / abs3,
              this["im"] / abs3
            );
          },
          /**
           * Adds two complex numbers
           *
           * @returns {Complex}
           */
          "add": function(a, b) {
            var z = new Complex3(a, b);
            if (this["isInfinite"]() && z["isInfinite"]()) {
              return Complex3["NAN"];
            }
            if (this["isInfinite"]() || z["isInfinite"]()) {
              return Complex3["INFINITY"];
            }
            return new Complex3(
              this["re"] + z["re"],
              this["im"] + z["im"]
            );
          },
          /**
           * Subtracts two complex numbers
           *
           * @returns {Complex}
           */
          "sub": function(a, b) {
            var z = new Complex3(a, b);
            if (this["isInfinite"]() && z["isInfinite"]()) {
              return Complex3["NAN"];
            }
            if (this["isInfinite"]() || z["isInfinite"]()) {
              return Complex3["INFINITY"];
            }
            return new Complex3(
              this["re"] - z["re"],
              this["im"] - z["im"]
            );
          },
          /**
           * Multiplies two complex numbers
           *
           * @returns {Complex}
           */
          "mul": function(a, b) {
            var z = new Complex3(a, b);
            if (this["isInfinite"]() && z["isZero"]() || this["isZero"]() && z["isInfinite"]()) {
              return Complex3["NAN"];
            }
            if (this["isInfinite"]() || z["isInfinite"]()) {
              return Complex3["INFINITY"];
            }
            if (z["im"] === 0 && this["im"] === 0) {
              return new Complex3(this["re"] * z["re"], 0);
            }
            return new Complex3(
              this["re"] * z["re"] - this["im"] * z["im"],
              this["re"] * z["im"] + this["im"] * z["re"]
            );
          },
          /**
           * Divides two complex numbers
           *
           * @returns {Complex}
           */
          "div": function(a, b) {
            var z = new Complex3(a, b);
            if (this["isZero"]() && z["isZero"]() || this["isInfinite"]() && z["isInfinite"]()) {
              return Complex3["NAN"];
            }
            if (this["isInfinite"]() || z["isZero"]()) {
              return Complex3["INFINITY"];
            }
            if (this["isZero"]() || z["isInfinite"]()) {
              return Complex3["ZERO"];
            }
            a = this["re"];
            b = this["im"];
            var c = z["re"];
            var d = z["im"];
            var t, x;
            if (0 === d) {
              return new Complex3(a / c, b / c);
            }
            if (Math.abs(c) < Math.abs(d)) {
              x = c / d;
              t = c * x + d;
              return new Complex3(
                (a * x + b) / t,
                (b * x - a) / t
              );
            } else {
              x = d / c;
              t = d * x + c;
              return new Complex3(
                (a + b * x) / t,
                (b - a * x) / t
              );
            }
          },
          /**
           * Calculate the power of two complex numbers
           *
           * @returns {Complex}
           */
          "pow": function(a, b) {
            var z = new Complex3(a, b);
            a = this["re"];
            b = this["im"];
            if (z["isZero"]()) {
              return Complex3["ONE"];
            }
            if (z["im"] === 0) {
              if (b === 0 && a > 0) {
                return new Complex3(Math.pow(a, z["re"]), 0);
              } else if (a === 0) {
                switch ((z["re"] % 4 + 4) % 4) {
                  case 0:
                    return new Complex3(Math.pow(b, z["re"]), 0);
                  case 1:
                    return new Complex3(0, Math.pow(b, z["re"]));
                  case 2:
                    return new Complex3(-Math.pow(b, z["re"]), 0);
                  case 3:
                    return new Complex3(0, -Math.pow(b, z["re"]));
                }
              }
            }
            if (a === 0 && b === 0 && z["re"] > 0 && z["im"] >= 0) {
              return Complex3["ZERO"];
            }
            var arg2 = Math.atan2(b, a);
            var loh = logHypot(a, b);
            a = Math.exp(z["re"] * loh - z["im"] * arg2);
            b = z["im"] * loh + z["re"] * arg2;
            return new Complex3(
              a * Math.cos(b),
              a * Math.sin(b)
            );
          },
          /**
           * Calculate the complex square root
           *
           * @returns {Complex}
           */
          "sqrt": function() {
            var a = this["re"];
            var b = this["im"];
            var r = this["abs"]();
            var re2, im2;
            if (a >= 0) {
              if (b === 0) {
                return new Complex3(Math.sqrt(a), 0);
              }
              re2 = 0.5 * Math.sqrt(2 * (r + a));
            } else {
              re2 = Math.abs(b) / Math.sqrt(2 * (r - a));
            }
            if (a <= 0) {
              im2 = 0.5 * Math.sqrt(2 * (r - a));
            } else {
              im2 = Math.abs(b) / Math.sqrt(2 * (r + a));
            }
            return new Complex3(re2, b < 0 ? -im2 : im2);
          },
          /**
           * Calculate the complex exponent
           *
           * @returns {Complex}
           */
          "exp": function() {
            var tmp = Math.exp(this["re"]);
            if (this["im"] === 0) {
            }
            return new Complex3(
              tmp * Math.cos(this["im"]),
              tmp * Math.sin(this["im"])
            );
          },
          /**
           * Calculate the complex exponent and subtracts one.
           *
           * This may be more accurate than `Complex(x).exp().sub(1)` if
           * `x` is small.
           *
           * @returns {Complex}
           */
          "expm1": function() {
            var a = this["re"];
            var b = this["im"];
            return new Complex3(
              Math.expm1(a) * Math.cos(b) + cosm1(b),
              Math.exp(a) * Math.sin(b)
            );
          },
          /**
           * Calculate the natural log
           *
           * @returns {Complex}
           */
          "log": function() {
            var a = this["re"];
            var b = this["im"];
            if (b === 0 && a > 0) {
            }
            return new Complex3(
              logHypot(a, b),
              Math.atan2(b, a)
            );
          },
          /**
           * Calculate the magnitude of the complex number
           *
           * @returns {number}
           */
          "abs": function() {
            return hypot3(this["re"], this["im"]);
          },
          /**
           * Calculate the angle of the complex number
           *
           * @returns {number}
           */
          "arg": function() {
            return Math.atan2(this["im"], this["re"]);
          },
          /**
           * Calculate the sine of the complex number
           *
           * @returns {Complex}
           */
          "sin": function() {
            var a = this["re"];
            var b = this["im"];
            return new Complex3(
              Math.sin(a) * cosh4(b),
              Math.cos(a) * sinh4(b)
            );
          },
          /**
           * Calculate the cosine
           *
           * @returns {Complex}
           */
          "cos": function() {
            var a = this["re"];
            var b = this["im"];
            return new Complex3(
              Math.cos(a) * cosh4(b),
              -Math.sin(a) * sinh4(b)
            );
          },
          /**
           * Calculate the tangent
           *
           * @returns {Complex}
           */
          "tan": function() {
            var a = 2 * this["re"];
            var b = 2 * this["im"];
            var d = Math.cos(a) + cosh4(b);
            return new Complex3(
              Math.sin(a) / d,
              sinh4(b) / d
            );
          },
          /**
           * Calculate the cotangent
           *
           * @returns {Complex}
           */
          "cot": function() {
            var a = 2 * this["re"];
            var b = 2 * this["im"];
            var d = Math.cos(a) - cosh4(b);
            return new Complex3(
              -Math.sin(a) / d,
              sinh4(b) / d
            );
          },
          /**
           * Calculate the secant
           *
           * @returns {Complex}
           */
          "sec": function() {
            var a = this["re"];
            var b = this["im"];
            var d = 0.5 * cosh4(2 * b) + 0.5 * Math.cos(2 * a);
            return new Complex3(
              Math.cos(a) * cosh4(b) / d,
              Math.sin(a) * sinh4(b) / d
            );
          },
          /**
           * Calculate the cosecans
           *
           * @returns {Complex}
           */
          "csc": function() {
            var a = this["re"];
            var b = this["im"];
            var d = 0.5 * cosh4(2 * b) - 0.5 * Math.cos(2 * a);
            return new Complex3(
              Math.sin(a) * cosh4(b) / d,
              -Math.cos(a) * sinh4(b) / d
            );
          },
          /**
           * Calculate the complex arcus sinus
           *
           * @returns {Complex}
           */
          "asin": function() {
            var a = this["re"];
            var b = this["im"];
            var t1 = new Complex3(
              b * b - a * a + 1,
              -2 * a * b
            )["sqrt"]();
            var t2 = new Complex3(
              t1["re"] - b,
              t1["im"] + a
            )["log"]();
            return new Complex3(t2["im"], -t2["re"]);
          },
          /**
           * Calculate the complex arcus cosinus
           *
           * @returns {Complex}
           */
          "acos": function() {
            var a = this["re"];
            var b = this["im"];
            var t1 = new Complex3(
              b * b - a * a + 1,
              -2 * a * b
            )["sqrt"]();
            var t2 = new Complex3(
              t1["re"] - b,
              t1["im"] + a
            )["log"]();
            return new Complex3(Math.PI / 2 - t2["im"], t2["re"]);
          },
          /**
           * Calculate the complex arcus tangent
           *
           * @returns {Complex}
           */
          "atan": function() {
            var a = this["re"];
            var b = this["im"];
            if (a === 0) {
              if (b === 1) {
                return new Complex3(0, Infinity);
              }
              if (b === -1) {
                return new Complex3(0, -Infinity);
              }
            }
            var d = a * a + (1 - b) * (1 - b);
            var t1 = new Complex3(
              (1 - b * b - a * a) / d,
              -2 * a / d
            ).log();
            return new Complex3(-0.5 * t1["im"], 0.5 * t1["re"]);
          },
          /**
           * Calculate the complex arcus cotangent
           *
           * @returns {Complex}
           */
          "acot": function() {
            var a = this["re"];
            var b = this["im"];
            if (b === 0) {
              return new Complex3(Math.atan2(1, a), 0);
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).atan() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).atan();
          },
          /**
           * Calculate the complex arcus secant
           *
           * @returns {Complex}
           */
          "asec": function() {
            var a = this["re"];
            var b = this["im"];
            if (a === 0 && b === 0) {
              return new Complex3(0, Infinity);
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).acos() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).acos();
          },
          /**
           * Calculate the complex arcus cosecans
           *
           * @returns {Complex}
           */
          "acsc": function() {
            var a = this["re"];
            var b = this["im"];
            if (a === 0 && b === 0) {
              return new Complex3(Math.PI / 2, Infinity);
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).asin() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).asin();
          },
          /**
           * Calculate the complex sinh
           *
           * @returns {Complex}
           */
          "sinh": function() {
            var a = this["re"];
            var b = this["im"];
            return new Complex3(
              sinh4(a) * Math.cos(b),
              cosh4(a) * Math.sin(b)
            );
          },
          /**
           * Calculate the complex cosh
           *
           * @returns {Complex}
           */
          "cosh": function() {
            var a = this["re"];
            var b = this["im"];
            return new Complex3(
              cosh4(a) * Math.cos(b),
              sinh4(a) * Math.sin(b)
            );
          },
          /**
           * Calculate the complex tanh
           *
           * @returns {Complex}
           */
          "tanh": function() {
            var a = 2 * this["re"];
            var b = 2 * this["im"];
            var d = cosh4(a) + Math.cos(b);
            return new Complex3(
              sinh4(a) / d,
              Math.sin(b) / d
            );
          },
          /**
           * Calculate the complex coth
           *
           * @returns {Complex}
           */
          "coth": function() {
            var a = 2 * this["re"];
            var b = 2 * this["im"];
            var d = cosh4(a) - Math.cos(b);
            return new Complex3(
              sinh4(a) / d,
              -Math.sin(b) / d
            );
          },
          /**
           * Calculate the complex coth
           *
           * @returns {Complex}
           */
          "csch": function() {
            var a = this["re"];
            var b = this["im"];
            var d = Math.cos(2 * b) - cosh4(2 * a);
            return new Complex3(
              -2 * sinh4(a) * Math.cos(b) / d,
              2 * cosh4(a) * Math.sin(b) / d
            );
          },
          /**
           * Calculate the complex sech
           *
           * @returns {Complex}
           */
          "sech": function() {
            var a = this["re"];
            var b = this["im"];
            var d = Math.cos(2 * b) + cosh4(2 * a);
            return new Complex3(
              2 * cosh4(a) * Math.cos(b) / d,
              -2 * sinh4(a) * Math.sin(b) / d
            );
          },
          /**
           * Calculate the complex asinh
           *
           * @returns {Complex}
           */
          "asinh": function() {
            var tmp = this["im"];
            this["im"] = -this["re"];
            this["re"] = tmp;
            var res = this["asin"]();
            this["re"] = -this["im"];
            this["im"] = tmp;
            tmp = res["re"];
            res["re"] = -res["im"];
            res["im"] = tmp;
            return res;
          },
          /**
           * Calculate the complex acosh
           *
           * @returns {Complex}
           */
          "acosh": function() {
            var res = this["acos"]();
            if (res["im"] <= 0) {
              var tmp = res["re"];
              res["re"] = -res["im"];
              res["im"] = tmp;
            } else {
              var tmp = res["im"];
              res["im"] = -res["re"];
              res["re"] = tmp;
            }
            return res;
          },
          /**
           * Calculate the complex atanh
           *
           * @returns {Complex}
           */
          "atanh": function() {
            var a = this["re"];
            var b = this["im"];
            var noIM = a > 1 && b === 0;
            var oneMinus = 1 - a;
            var onePlus = 1 + a;
            var d = oneMinus * oneMinus + b * b;
            var x = d !== 0 ? new Complex3(
              (onePlus * oneMinus - b * b) / d,
              (b * oneMinus + onePlus * b) / d
            ) : new Complex3(
              a !== -1 ? a / 0 : 0,
              b !== 0 ? b / 0 : 0
            );
            var temp = x["re"];
            x["re"] = logHypot(x["re"], x["im"]) / 2;
            x["im"] = Math.atan2(x["im"], temp) / 2;
            if (noIM) {
              x["im"] = -x["im"];
            }
            return x;
          },
          /**
           * Calculate the complex acoth
           *
           * @returns {Complex}
           */
          "acoth": function() {
            var a = this["re"];
            var b = this["im"];
            if (a === 0 && b === 0) {
              return new Complex3(0, Math.PI / 2);
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).atanh() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).atanh();
          },
          /**
           * Calculate the complex acsch
           *
           * @returns {Complex}
           */
          "acsch": function() {
            var a = this["re"];
            var b = this["im"];
            if (b === 0) {
              return new Complex3(
                a !== 0 ? Math.log(a + Math.sqrt(a * a + 1)) : Infinity,
                0
              );
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).asinh() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).asinh();
          },
          /**
           * Calculate the complex asech
           *
           * @returns {Complex}
           */
          "asech": function() {
            var a = this["re"];
            var b = this["im"];
            if (this["isZero"]()) {
              return Complex3["INFINITY"];
            }
            var d = a * a + b * b;
            return d !== 0 ? new Complex3(
              a / d,
              -b / d
            ).acosh() : new Complex3(
              a !== 0 ? a / 0 : 0,
              b !== 0 ? -b / 0 : 0
            ).acosh();
          },
          /**
           * Calculate the complex inverse 1/z
           *
           * @returns {Complex}
           */
          "inverse": function() {
            if (this["isZero"]()) {
              return Complex3["INFINITY"];
            }
            if (this["isInfinite"]()) {
              return Complex3["ZERO"];
            }
            var a = this["re"];
            var b = this["im"];
            var d = a * a + b * b;
            return new Complex3(a / d, -b / d);
          },
          /**
           * Returns the complex conjugate
           *
           * @returns {Complex}
           */
          "conjugate": function() {
            return new Complex3(this["re"], -this["im"]);
          },
          /**
           * Gets the negated complex number
           *
           * @returns {Complex}
           */
          "neg": function() {
            return new Complex3(-this["re"], -this["im"]);
          },
          /**
           * Ceils the actual complex number
           *
           * @returns {Complex}
           */
          "ceil": function(places) {
            places = Math.pow(10, places || 0);
            return new Complex3(
              Math.ceil(this["re"] * places) / places,
              Math.ceil(this["im"] * places) / places
            );
          },
          /**
           * Floors the actual complex number
           *
           * @returns {Complex}
           */
          "floor": function(places) {
            places = Math.pow(10, places || 0);
            return new Complex3(
              Math.floor(this["re"] * places) / places,
              Math.floor(this["im"] * places) / places
            );
          },
          /**
           * Ceils the actual complex number
           *
           * @returns {Complex}
           */
          "round": function(places) {
            places = Math.pow(10, places || 0);
            return new Complex3(
              Math.round(this["re"] * places) / places,
              Math.round(this["im"] * places) / places
            );
          },
          /**
           * Compares two complex numbers
           *
           * **Note:** new Complex(Infinity).equals(Infinity) === false
           *
           * @returns {boolean}
           */
          "equals": function(a, b) {
            var z = new Complex3(a, b);
            return Math.abs(z["re"] - this["re"]) <= Complex3["EPSILON"] && Math.abs(z["im"] - this["im"]) <= Complex3["EPSILON"];
          },
          /**
           * Clones the actual object
           *
           * @returns {Complex}
           */
          "clone": function() {
            return new Complex3(this["re"], this["im"]);
          },
          /**
           * Gets a string of the actual complex number
           *
           * @returns {string}
           */
          "toString": function() {
            var a = this["re"];
            var b = this["im"];
            var ret = "";
            if (this["isNaN"]()) {
              return "NaN";
            }
            if (this["isInfinite"]()) {
              return "Infinity";
            }
            if (Math.abs(a) < Complex3["EPSILON"]) {
              a = 0;
            }
            if (Math.abs(b) < Complex3["EPSILON"]) {
              b = 0;
            }
            if (b === 0) {
              return ret + a;
            }
            if (a !== 0) {
              ret += a;
              ret += " ";
              if (b < 0) {
                b = -b;
                ret += "-";
              } else {
                ret += "+";
              }
              ret += " ";
            } else if (b < 0) {
              b = -b;
              ret += "-";
            }
            if (1 !== b) {
              ret += b;
            }
            return ret + "i";
          },
          /**
           * Returns the actual number as a vector
           *
           * @returns {Array}
           */
          "toVector": function() {
            return [this["re"], this["im"]];
          },
          /**
           * Returns the actual real value of the current object
           *
           * @returns {number|null}
           */
          "valueOf": function() {
            if (this["im"] === 0) {
              return this["re"];
            }
            return null;
          },
          /**
           * Determines whether a complex number is not on the Riemann sphere.
           *
           * @returns {boolean}
           */
          "isNaN": function() {
            return isNaN(this["re"]) || isNaN(this["im"]);
          },
          /**
           * Determines whether or not a complex number is at the zero pole of the
           * Riemann sphere.
           *
           * @returns {boolean}
           */
          "isZero": function() {
            return this["im"] === 0 && this["re"] === 0;
          },
          /**
           * Determines whether a complex number is not at the infinity pole of the
           * Riemann sphere.
           *
           * @returns {boolean}
           */
          "isFinite": function() {
            return isFinite(this["re"]) && isFinite(this["im"]);
          },
          /**
           * Determines whether or not a complex number is at the infinity pole of the
           * Riemann sphere.
           *
           * @returns {boolean}
           */
          "isInfinite": function() {
            return !(this["isNaN"]() || this["isFinite"]());
          }
        };
        Complex3["ZERO"] = new Complex3(0, 0);
        Complex3["ONE"] = new Complex3(1, 0);
        Complex3["I"] = new Complex3(0, 1);
        Complex3["PI"] = new Complex3(Math.PI, 0);
        Complex3["E"] = new Complex3(Math.E, 0);
        Complex3["INFINITY"] = new Complex3(Infinity, Infinity);
        Complex3["NAN"] = new Complex3(NaN, NaN);
        Complex3["EPSILON"] = 1e-15;
        if (typeof define === "function" && define["amd"]) {
          define([], function() {
            return Complex3;
          });
        } else if (typeof exports === "object") {
          Object.defineProperty(Complex3, "__esModule", { "value": true });
          Complex3["default"] = Complex3;
          Complex3["Complex"] = Complex3;
          module["exports"] = Complex3;
        } else {
          root["Complex"] = Complex3;
        }
      })(exports);
    }
  });

  // node_modules/fraction.js/fraction.js
  var require_fraction = __commonJS({
    "node_modules/fraction.js/fraction.js"(exports, module) {
      (function(root) {
        "use strict";
        var MAX_CYCLE_LEN = 2e3;
        var P3 = {
          "s": 1,
          "n": 0,
          "d": 1
        };
        function assign2(n, s) {
          if (isNaN(n = parseInt(n, 10))) {
            throw InvalidParameter();
          }
          return n * s;
        }
        function newFraction(n, d) {
          if (d === 0) {
            throw DivisionByZero();
          }
          var f = Object.create(Fraction3.prototype);
          f["s"] = n < 0 ? -1 : 1;
          n = n < 0 ? -n : n;
          var a = gcd2(n, d);
          f["n"] = n / a;
          f["d"] = d / a;
          return f;
        }
        function factorize(num) {
          var factors = {};
          var n = num;
          var i3 = 2;
          var s = 4;
          while (s <= n) {
            while (n % i3 === 0) {
              n /= i3;
              factors[i3] = (factors[i3] || 0) + 1;
            }
            s += 1 + 2 * i3++;
          }
          if (n !== num) {
            if (n > 1)
              factors[n] = (factors[n] || 0) + 1;
          } else {
            factors[num] = (factors[num] || 0) + 1;
          }
          return factors;
        }
        var parse2 = function(p1, p2) {
          var n = 0, d = 1, s = 1;
          var v = 0, w2 = 0, x = 0, y2 = 1, z = 1;
          var A2 = 0, B2 = 1;
          var C2 = 1, D2 = 1;
          var N = 1e7;
          var M;
          if (p1 === void 0 || p1 === null) {
          } else if (p2 !== void 0) {
            n = p1;
            d = p2;
            s = n * d;
            if (n % 1 !== 0 || d % 1 !== 0) {
              throw NonIntegerParameter();
            }
          } else
            switch (typeof p1) {
              case "object": {
                if ("d" in p1 && "n" in p1) {
                  n = p1["n"];
                  d = p1["d"];
                  if ("s" in p1)
                    n *= p1["s"];
                } else if (0 in p1) {
                  n = p1[0];
                  if (1 in p1)
                    d = p1[1];
                } else {
                  throw InvalidParameter();
                }
                s = n * d;
                break;
              }
              case "number": {
                if (p1 < 0) {
                  s = p1;
                  p1 = -p1;
                }
                if (p1 % 1 === 0) {
                  n = p1;
                } else if (p1 > 0) {
                  if (p1 >= 1) {
                    z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                    p1 /= z;
                  }
                  while (B2 <= N && D2 <= N) {
                    M = (A2 + C2) / (B2 + D2);
                    if (p1 === M) {
                      if (B2 + D2 <= N) {
                        n = A2 + C2;
                        d = B2 + D2;
                      } else if (D2 > B2) {
                        n = C2;
                        d = D2;
                      } else {
                        n = A2;
                        d = B2;
                      }
                      break;
                    } else {
                      if (p1 > M) {
                        A2 += C2;
                        B2 += D2;
                      } else {
                        C2 += A2;
                        D2 += B2;
                      }
                      if (B2 > N) {
                        n = C2;
                        d = D2;
                      } else {
                        n = A2;
                        d = B2;
                      }
                    }
                  }
                  n *= z;
                } else if (isNaN(p1) || isNaN(p2)) {
                  d = n = NaN;
                }
                break;
              }
              case "string": {
                B2 = p1.match(/\d+|./g);
                if (B2 === null)
                  throw InvalidParameter();
                if (B2[A2] === "-") {
                  s = -1;
                  A2++;
                } else if (B2[A2] === "+") {
                  A2++;
                }
                if (B2.length === A2 + 1) {
                  w2 = assign2(B2[A2++], s);
                } else if (B2[A2 + 1] === "." || B2[A2] === ".") {
                  if (B2[A2] !== ".") {
                    v = assign2(B2[A2++], s);
                  }
                  A2++;
                  if (A2 + 1 === B2.length || B2[A2 + 1] === "(" && B2[A2 + 3] === ")" || B2[A2 + 1] === "'" && B2[A2 + 3] === "'") {
                    w2 = assign2(B2[A2], s);
                    y2 = Math.pow(10, B2[A2].length);
                    A2++;
                  }
                  if (B2[A2] === "(" && B2[A2 + 2] === ")" || B2[A2] === "'" && B2[A2 + 2] === "'") {
                    x = assign2(B2[A2 + 1], s);
                    z = Math.pow(10, B2[A2 + 1].length) - 1;
                    A2 += 3;
                  }
                } else if (B2[A2 + 1] === "/" || B2[A2 + 1] === ":") {
                  w2 = assign2(B2[A2], s);
                  y2 = assign2(B2[A2 + 2], 1);
                  A2 += 3;
                } else if (B2[A2 + 3] === "/" && B2[A2 + 1] === " ") {
                  v = assign2(B2[A2], s);
                  w2 = assign2(B2[A2 + 2], s);
                  y2 = assign2(B2[A2 + 4], 1);
                  A2 += 5;
                }
                if (B2.length <= A2) {
                  d = y2 * z;
                  s = /* void */
                  n = x + d * v + z * w2;
                  break;
                }
              }
              default:
                throw InvalidParameter();
            }
          if (d === 0) {
            throw DivisionByZero();
          }
          P3["s"] = s < 0 ? -1 : 1;
          P3["n"] = Math.abs(n);
          P3["d"] = Math.abs(d);
        };
        function modpow(b, e3, m) {
          var r = 1;
          for (; e3 > 0; b = b * b % m, e3 >>= 1) {
            if (e3 & 1) {
              r = r * b % m;
            }
          }
          return r;
        }
        function cycleLen(n, d) {
          for (; d % 2 === 0; d /= 2) {
          }
          for (; d % 5 === 0; d /= 5) {
          }
          if (d === 1)
            return 0;
          var rem = 10 % d;
          var t = 1;
          for (; rem !== 1; t++) {
            rem = rem * 10 % d;
            if (t > MAX_CYCLE_LEN)
              return 0;
          }
          return t;
        }
        function cycleStart(n, d, len) {
          var rem1 = 1;
          var rem2 = modpow(10, len, d);
          for (var t = 0; t < 300; t++) {
            if (rem1 === rem2)
              return t;
            rem1 = rem1 * 10 % d;
            rem2 = rem2 * 10 % d;
          }
          return 0;
        }
        function gcd2(a, b) {
          if (!a)
            return b;
          if (!b)
            return a;
          while (1) {
            a %= b;
            if (!a)
              return b;
            b %= a;
            if (!b)
              return a;
          }
        }
        ;
        function Fraction3(a, b) {
          parse2(a, b);
          if (this instanceof Fraction3) {
            a = gcd2(P3["d"], P3["n"]);
            this["s"] = P3["s"];
            this["n"] = P3["n"] / a;
            this["d"] = P3["d"] / a;
          } else {
            return newFraction(P3["s"] * P3["n"], P3["d"]);
          }
        }
        var DivisionByZero = function() {
          return new Error("Division by Zero");
        };
        var InvalidParameter = function() {
          return new Error("Invalid argument");
        };
        var NonIntegerParameter = function() {
          return new Error("Parameters must be integer");
        };
        Fraction3.prototype = {
          "s": 1,
          "n": 0,
          "d": 1,
          /**
           * Calculates the absolute value
           *
           * Ex: new Fraction(-4).abs() => 4
           **/
          "abs": function() {
            return newFraction(this["n"], this["d"]);
          },
          /**
           * Inverts the sign of the current fraction
           *
           * Ex: new Fraction(-4).neg() => 4
           **/
          "neg": function() {
            return newFraction(-this["s"] * this["n"], this["d"]);
          },
          /**
           * Adds two rational numbers
           *
           * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
           **/
          "add": function(a, b) {
            parse2(a, b);
            return newFraction(
              this["s"] * this["n"] * P3["d"] + P3["s"] * this["d"] * P3["n"],
              this["d"] * P3["d"]
            );
          },
          /**
           * Subtracts two rational numbers
           *
           * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
           **/
          "sub": function(a, b) {
            parse2(a, b);
            return newFraction(
              this["s"] * this["n"] * P3["d"] - P3["s"] * this["d"] * P3["n"],
              this["d"] * P3["d"]
            );
          },
          /**
           * Multiplies two rational numbers
           *
           * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
           **/
          "mul": function(a, b) {
            parse2(a, b);
            return newFraction(
              this["s"] * P3["s"] * this["n"] * P3["n"],
              this["d"] * P3["d"]
            );
          },
          /**
           * Divides two rational numbers
           *
           * Ex: new Fraction("-17.(345)").inverse().div(3)
           **/
          "div": function(a, b) {
            parse2(a, b);
            return newFraction(
              this["s"] * P3["s"] * this["n"] * P3["d"],
              this["d"] * P3["n"]
            );
          },
          /**
           * Clones the actual object
           *
           * Ex: new Fraction("-17.(345)").clone()
           **/
          "clone": function() {
            return newFraction(this["s"] * this["n"], this["d"]);
          },
          /**
           * Calculates the modulo of two rational numbers - a more precise fmod
           *
           * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
           **/
          "mod": function(a, b) {
            if (isNaN(this["n"]) || isNaN(this["d"])) {
              return new Fraction3(NaN);
            }
            if (a === void 0) {
              return newFraction(this["s"] * this["n"] % this["d"], 1);
            }
            parse2(a, b);
            if (0 === P3["n"] && 0 === this["d"]) {
              throw DivisionByZero();
            }
            return newFraction(
              this["s"] * (P3["d"] * this["n"]) % (P3["n"] * this["d"]),
              P3["d"] * this["d"]
            );
          },
          /**
           * Calculates the fractional gcd of two rational numbers
           *
           * Ex: new Fraction(5,8).gcd(3,7) => 1/56
           */
          "gcd": function(a, b) {
            parse2(a, b);
            return newFraction(gcd2(P3["n"], this["n"]) * gcd2(P3["d"], this["d"]), P3["d"] * this["d"]);
          },
          /**
           * Calculates the fractional lcm of two rational numbers
           *
           * Ex: new Fraction(5,8).lcm(3,7) => 15
           */
          "lcm": function(a, b) {
            parse2(a, b);
            if (P3["n"] === 0 && this["n"] === 0) {
              return newFraction(0, 1);
            }
            return newFraction(P3["n"] * this["n"], gcd2(P3["n"], this["n"]) * gcd2(P3["d"], this["d"]));
          },
          /**
           * Calculates the ceil of a rational number
           *
           * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
           **/
          "ceil": function(places) {
            places = Math.pow(10, places || 0);
            if (isNaN(this["n"]) || isNaN(this["d"])) {
              return new Fraction3(NaN);
            }
            return newFraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
          },
          /**
           * Calculates the floor of a rational number
           *
           * Ex: new Fraction('4.(3)').floor() => (4 / 1)
           **/
          "floor": function(places) {
            places = Math.pow(10, places || 0);
            if (isNaN(this["n"]) || isNaN(this["d"])) {
              return new Fraction3(NaN);
            }
            return newFraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
          },
          /**
           * Rounds a rational numbers
           *
           * Ex: new Fraction('4.(3)').round() => (4 / 1)
           **/
          "round": function(places) {
            places = Math.pow(10, places || 0);
            if (isNaN(this["n"]) || isNaN(this["d"])) {
              return new Fraction3(NaN);
            }
            return newFraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
          },
          /**
           * Gets the inverse of the fraction, means numerator and denominator are exchanged
           *
           * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
           **/
          "inverse": function() {
            return newFraction(this["s"] * this["d"], this["n"]);
          },
          /**
           * Calculates the fraction to some rational exponent, if possible
           *
           * Ex: new Fraction(-1,2).pow(-3) => -8
           */
          "pow": function(a, b) {
            parse2(a, b);
            if (P3["d"] === 1) {
              if (P3["s"] < 0) {
                return newFraction(Math.pow(this["s"] * this["d"], P3["n"]), Math.pow(this["n"], P3["n"]));
              } else {
                return newFraction(Math.pow(this["s"] * this["n"], P3["n"]), Math.pow(this["d"], P3["n"]));
              }
            }
            if (this["s"] < 0)
              return null;
            var N = factorize(this["n"]);
            var D2 = factorize(this["d"]);
            var n = 1;
            var d = 1;
            for (var k in N) {
              if (k === "1")
                continue;
              if (k === "0") {
                n = 0;
                break;
              }
              N[k] *= P3["n"];
              if (N[k] % P3["d"] === 0) {
                N[k] /= P3["d"];
              } else
                return null;
              n *= Math.pow(k, N[k]);
            }
            for (var k in D2) {
              if (k === "1")
                continue;
              D2[k] *= P3["n"];
              if (D2[k] % P3["d"] === 0) {
                D2[k] /= P3["d"];
              } else
                return null;
              d *= Math.pow(k, D2[k]);
            }
            if (P3["s"] < 0) {
              return newFraction(d, n);
            }
            return newFraction(n, d);
          },
          /**
           * Check if two rational numbers are the same
           *
           * Ex: new Fraction(19.6).equals([98, 5]);
           **/
          "equals": function(a, b) {
            parse2(a, b);
            return this["s"] * this["n"] * P3["d"] === P3["s"] * P3["n"] * this["d"];
          },
          /**
           * Check if two rational numbers are the same
           *
           * Ex: new Fraction(19.6).equals([98, 5]);
           **/
          "compare": function(a, b) {
            parse2(a, b);
            var t = this["s"] * this["n"] * P3["d"] - P3["s"] * P3["n"] * this["d"];
            return (0 < t) - (t < 0);
          },
          "simplify": function(eps) {
            if (isNaN(this["n"]) || isNaN(this["d"])) {
              return this;
            }
            eps = eps || 1e-3;
            var thisABS = this["abs"]();
            var cont = thisABS["toContinued"]();
            for (var i3 = 1; i3 < cont.length; i3++) {
              var s = newFraction(cont[i3 - 1], 1);
              for (var k = i3 - 2; k >= 0; k--) {
                s = s["inverse"]()["add"](cont[k]);
              }
              if (Math.abs(s["sub"](thisABS).valueOf()) < eps) {
                return s["mul"](this["s"]);
              }
            }
            return this;
          },
          /**
           * Check if two rational numbers are divisible
           *
           * Ex: new Fraction(19.6).divisible(1.5);
           */
          "divisible": function(a, b) {
            parse2(a, b);
            return !(!(P3["n"] * this["d"]) || this["n"] * P3["d"] % (P3["n"] * this["d"]));
          },
          /**
           * Returns a decimal representation of the fraction
           *
           * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
           **/
          "valueOf": function() {
            return this["s"] * this["n"] / this["d"];
          },
          /**
           * Returns a string-fraction representation of a Fraction object
           *
           * Ex: new Fraction("1.'3'").toFraction(true) => "4 1/3"
           **/
          "toFraction": function(excludeWhole) {
            var whole, str = "";
            var n = this["n"];
            var d = this["d"];
            if (this["s"] < 0) {
              str += "-";
            }
            if (d === 1) {
              str += n;
            } else {
              if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
                str += whole;
                str += " ";
                n %= d;
              }
              str += n;
              str += "/";
              str += d;
            }
            return str;
          },
          /**
           * Returns a latex representation of a Fraction object
           *
           * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
           **/
          "toLatex": function(excludeWhole) {
            var whole, str = "";
            var n = this["n"];
            var d = this["d"];
            if (this["s"] < 0) {
              str += "-";
            }
            if (d === 1) {
              str += n;
            } else {
              if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
                str += whole;
                n %= d;
              }
              str += "\\frac{";
              str += n;
              str += "}{";
              str += d;
              str += "}";
            }
            return str;
          },
          /**
           * Returns an array of continued fraction elements
           *
           * Ex: new Fraction("7/8").toContinued() => [0,1,7]
           */
          "toContinued": function() {
            var t;
            var a = this["n"];
            var b = this["d"];
            var res = [];
            if (isNaN(a) || isNaN(b)) {
              return res;
            }
            do {
              res.push(Math.floor(a / b));
              t = a % b;
              a = b;
              b = t;
            } while (a !== 1);
            return res;
          },
          /**
           * Creates a string representation of a fraction with all digits
           *
           * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
           **/
          "toString": function(dec) {
            var N = this["n"];
            var D2 = this["d"];
            if (isNaN(N) || isNaN(D2)) {
              return "NaN";
            }
            dec = dec || 15;
            var cycLen = cycleLen(N, D2);
            var cycOff = cycleStart(N, D2, cycLen);
            var str = this["s"] < 0 ? "-" : "";
            str += N / D2 | 0;
            N %= D2;
            N *= 10;
            if (N)
              str += ".";
            if (cycLen) {
              for (var i3 = cycOff; i3--; ) {
                str += N / D2 | 0;
                N %= D2;
                N *= 10;
              }
              str += "(";
              for (var i3 = cycLen; i3--; ) {
                str += N / D2 | 0;
                N %= D2;
                N *= 10;
              }
              str += ")";
            } else {
              for (var i3 = dec; N && i3--; ) {
                str += N / D2 | 0;
                N %= D2;
                N *= 10;
              }
            }
            return str;
          }
        };
        if (typeof exports === "object") {
          Object.defineProperty(Fraction3, "__esModule", { "value": true });
          Fraction3["default"] = Fraction3;
          Fraction3["Fraction"] = Fraction3;
          module["exports"] = Fraction3;
        } else {
          root["Fraction"] = Fraction3;
        }
      })(exports);
    }
  });

  // node_modules/javascript-natural-sort/naturalSort.js
  var require_naturalSort = __commonJS({
    "node_modules/javascript-natural-sort/naturalSort.js"(exports, module) {
      module.exports = function naturalSort2(a, b) {
        "use strict";
        var re2 = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi, sre = /(^[ ]*|[ ]*$)/g, dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/, hre = /^0x[0-9a-f]+$/i, ore = /^0/, i3 = function(s) {
          return naturalSort2.insensitive && ("" + s).toLowerCase() || "" + s;
        }, x = i3(a).replace(sre, "") || "", y2 = i3(b).replace(sre, "") || "", xN = x.replace(re2, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"), yN = y2.replace(re2, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"), xD = parseInt(x.match(hre), 16) || xN.length !== 1 && x.match(dre) && Date.parse(x), yD = parseInt(y2.match(hre), 16) || xD && y2.match(dre) && Date.parse(y2) || null, oFxNcL, oFyNcL;
        if (yD) {
          if (xD < yD) {
            return -1;
          } else if (xD > yD) {
            return 1;
          }
        }
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
          oFxNcL = !(xN[cLoc] || "").match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
          oFyNcL = !(yN[cLoc] || "").match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
          if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
            return isNaN(oFxNcL) ? 1 : -1;
          } else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += "";
            oFyNcL += "";
          }
          if (oFxNcL < oFyNcL) {
            return -1;
          }
          if (oFxNcL > oFyNcL) {
            return 1;
          }
        }
        return 0;
      };
    }
  });

  // node_modules/escape-latex/dist/index.js
  var require_dist = __commonJS({
    "node_modules/escape-latex/dist/index.js"(exports, module) {
      "use strict";
      var _extends2 = Object.assign || function(target) {
        for (var i3 = 1; i3 < arguments.length; i3++) {
          var source = arguments[i3];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      var defaultEscapes = {
        "{": "\\{",
        "}": "\\}",
        "\\": "\\textbackslash{}",
        "#": "\\#",
        $: "\\$",
        "%": "\\%",
        "&": "\\&",
        "^": "\\textasciicircum{}",
        _: "\\_",
        "~": "\\textasciitilde{}"
      };
      var formatEscapes = {
        "\u2013": "\\--",
        "\u2014": "\\---",
        " ": "~",
        "	": "\\qquad{}",
        "\r\n": "\\newline{}",
        "\n": "\\newline{}"
      };
      var defaultEscapeMapFn = function defaultEscapeMapFn2(defaultEscapes2, formatEscapes2) {
        return _extends2({}, defaultEscapes2, formatEscapes2);
      };
      module.exports = function(str) {
        var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$preserveFormatti = _ref.preserveFormatting, preserveFormatting = _ref$preserveFormatti === void 0 ? false : _ref$preserveFormatti, _ref$escapeMapFn = _ref.escapeMapFn, escapeMapFn = _ref$escapeMapFn === void 0 ? defaultEscapeMapFn : _ref$escapeMapFn;
        var runningStr = String(str);
        var result = "";
        var escapes = escapeMapFn(_extends2({}, defaultEscapes), preserveFormatting ? _extends2({}, formatEscapes) : {});
        var escapeKeys = Object.keys(escapes);
        var _loop = function _loop2() {
          var specialCharFound = false;
          escapeKeys.forEach(function(key, index2) {
            if (specialCharFound) {
              return;
            }
            if (runningStr.length >= key.length && runningStr.slice(0, key.length) === key) {
              result += escapes[escapeKeys[index2]];
              runningStr = runningStr.slice(key.length, runningStr.length);
              specialCharFound = true;
            }
          });
          if (!specialCharFound) {
            result += runningStr.slice(0, 1);
            runningStr = runningStr.slice(1, runningStr.length);
          }
        };
        while (runningStr) {
          _loop();
        }
        return result;
      };
    }
  });

  // node_modules/seedrandom/lib/alea.js
  var require_alea = __commonJS({
    "node_modules/seedrandom/lib/alea.js"(exports, module) {
      (function(global, module2, define2) {
        function Alea(seed) {
          var me = this, mash = Mash();
          me.next = function() {
            var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
            me.s0 = me.s1;
            me.s1 = me.s2;
            return me.s2 = t - (me.c = t | 0);
          };
          me.c = 1;
          me.s0 = mash(" ");
          me.s1 = mash(" ");
          me.s2 = mash(" ");
          me.s0 -= mash(seed);
          if (me.s0 < 0) {
            me.s0 += 1;
          }
          me.s1 -= mash(seed);
          if (me.s1 < 0) {
            me.s1 += 1;
          }
          me.s2 -= mash(seed);
          if (me.s2 < 0) {
            me.s2 += 1;
          }
          mash = null;
        }
        function copy(f, t) {
          t.c = f.c;
          t.s0 = f.s0;
          t.s1 = f.s1;
          t.s2 = f.s2;
          return t;
        }
        function impl(seed, opts) {
          var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
          prng.int32 = function() {
            return xg.next() * 4294967296 | 0;
          };
          prng.double = function() {
            return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
          };
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        function Mash() {
          var n = 4022871197;
          var mash = function(data) {
            data = String(data);
            for (var i3 = 0; i3 < data.length; i3++) {
              n += data.charCodeAt(i3);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 4294967296;
            }
            return (n >>> 0) * 23283064365386963e-26;
          };
          return mash;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.alea = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xor128.js
  var require_xor128 = __commonJS({
    "node_modules/seedrandom/lib/xor128.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.next = function() {
            var t = me.x ^ me.x << 11;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
          };
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor128 = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xorwow.js
  var require_xorwow = __commonJS({
    "node_modules/seedrandom/lib/xorwow.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var t = me.x ^ me.x >>> 2;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            me.w = me.v;
            return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
          };
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.v = 0;
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            if (k == strseed.length) {
              me.d = me.x << 10 ^ me.x >>> 4;
            }
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          t.v = f.v;
          t.d = f.d;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorwow = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xorshift7.js
  var require_xorshift7 = __commonJS({
    "node_modules/seedrandom/lib/xorshift7.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var X = me.x, i3 = me.i, t, v, w2;
            t = X[i3];
            t ^= t >>> 7;
            v = t ^ t << 24;
            t = X[i3 + 1 & 7];
            v ^= t ^ t >>> 10;
            t = X[i3 + 3 & 7];
            v ^= t ^ t >>> 3;
            t = X[i3 + 4 & 7];
            v ^= t ^ t << 7;
            t = X[i3 + 7 & 7];
            t = t ^ t << 13;
            v ^= t ^ t << 9;
            X[i3] = v;
            me.i = i3 + 1 & 7;
            return v;
          };
          function init(me2, seed2) {
            var j, w2, X = [];
            if (seed2 === (seed2 | 0)) {
              w2 = X[0] = seed2;
            } else {
              seed2 = "" + seed2;
              for (j = 0; j < seed2.length; ++j) {
                X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
              }
            }
            while (X.length < 8)
              X.push(0);
            for (j = 0; j < 8 && X[j] === 0; ++j)
              ;
            if (j == 8)
              w2 = X[7] = -1;
            else
              w2 = X[j];
            me2.x = X;
            me2.i = 0;
            for (j = 256; j > 0; --j) {
              me2.next();
            }
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.x = f.x.slice();
          t.i = f.i;
          return t;
        }
        function impl(seed, opts) {
          if (seed == null)
            seed = +/* @__PURE__ */ new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.x)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorshift7 = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xor4096.js
  var require_xor4096 = __commonJS({
    "node_modules/seedrandom/lib/xor4096.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var w2 = me.w, X = me.X, i3 = me.i, t, v;
            me.w = w2 = w2 + 1640531527 | 0;
            v = X[i3 + 34 & 127];
            t = X[i3 = i3 + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            v = X[i3] = v ^ t;
            me.i = i3;
            return v + (w2 ^ w2 >>> 16) | 0;
          };
          function init(me2, seed2) {
            var t, v, i3, j, w2, X = [], limit = 128;
            if (seed2 === (seed2 | 0)) {
              v = seed2;
              seed2 = null;
            } else {
              seed2 = seed2 + "\0";
              v = 0;
              limit = Math.max(limit, seed2.length);
            }
            for (i3 = 0, j = -32; j < limit; ++j) {
              if (seed2)
                v ^= seed2.charCodeAt((j + 32) % seed2.length);
              if (j === 0)
                w2 = v;
              v ^= v << 10;
              v ^= v >>> 15;
              v ^= v << 4;
              v ^= v >>> 13;
              if (j >= 0) {
                w2 = w2 + 1640531527 | 0;
                t = X[j & 127] ^= v + w2;
                i3 = 0 == t ? i3 + 1 : 0;
              }
            }
            if (i3 >= 128) {
              X[(seed2 && seed2.length || 0) & 127] = -1;
            }
            i3 = 127;
            for (j = 4 * 128; j > 0; --j) {
              v = X[i3 + 34 & 127];
              t = X[i3 = i3 + 1 & 127];
              v ^= v << 13;
              t ^= t << 17;
              v ^= v >>> 15;
              t ^= t >>> 12;
              X[i3] = v ^ t;
            }
            me2.w = w2;
            me2.X = X;
            me2.i = i3;
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.i = f.i;
          t.w = f.w;
          t.X = f.X.slice();
          return t;
        }
        ;
        function impl(seed, opts) {
          if (seed == null)
            seed = +/* @__PURE__ */ new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.X)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor4096 = impl;
        }
      })(
        exports,
        // window object or global
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/tychei.js
  var require_tychei = __commonJS({
    "node_modules/seedrandom/lib/tychei.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var b = me.b, c = me.c, d = me.d, a = me.a;
            b = b << 25 ^ b >>> 7 ^ c;
            c = c - d | 0;
            d = d << 24 ^ d >>> 8 ^ a;
            a = a - b | 0;
            me.b = b = b << 20 ^ b >>> 12 ^ c;
            me.c = c = c - d | 0;
            me.d = d << 16 ^ c >>> 16 ^ a;
            return me.a = a - b | 0;
          };
          me.a = 0;
          me.b = 0;
          me.c = 2654435769 | 0;
          me.d = 1367130551;
          if (seed === Math.floor(seed)) {
            me.a = seed / 4294967296 | 0;
            me.b = seed | 0;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 20; k++) {
            me.b ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.a = f.a;
          t.b = f.b;
          t.c = f.c;
          t.d = f.d;
          return t;
        }
        ;
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.tychei = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/seedrandom/seedrandom.js
  var require_seedrandom = __commonJS({
    "node_modules/seedrandom/seedrandom.js"(exports, module) {
      (function(global, pool, math2) {
        var width = 256, chunks = 6, digits2 = 52, rngname = "random", startdenom = math2.pow(width, chunks), significance = math2.pow(2, digits2), overflow = significance * 2, mask = width - 1, nodecrypto;
        function seedrandom2(seed, options, callback) {
          var key = [];
          options = options == true ? { entropy: true } : options || {};
          var shortseed = mixkey(flatten3(
            options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed,
            3
          ), key);
          var arc4 = new ARC4(key);
          var prng = function() {
            var n = arc4.g(chunks), d = startdenom, x = 0;
            while (n < significance) {
              n = (n + x) * width;
              d *= width;
              x = arc4.g(1);
            }
            while (n >= overflow) {
              n /= 2;
              d /= 2;
              x >>>= 1;
            }
            return (n + x) / d;
          };
          prng.int32 = function() {
            return arc4.g(4) | 0;
          };
          prng.quick = function() {
            return arc4.g(4) / 4294967296;
          };
          prng.double = prng;
          mixkey(tostring(arc4.S), pool);
          return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
            if (state) {
              if (state.S) {
                copy(state, arc4);
              }
              prng2.state = function() {
                return copy(arc4, {});
              };
            }
            if (is_math_call) {
              math2[rngname] = prng2;
              return seed2;
            } else
              return prng2;
          })(
            prng,
            shortseed,
            "global" in options ? options.global : this == math2,
            options.state
          );
        }
        function ARC4(key) {
          var t, keylen = key.length, me = this, i3 = 0, j = me.i = me.j = 0, s = me.S = [];
          if (!keylen) {
            key = [keylen++];
          }
          while (i3 < width) {
            s[i3] = i3++;
          }
          for (i3 = 0; i3 < width; i3++) {
            s[i3] = s[j = mask & j + key[i3 % keylen] + (t = s[i3])];
            s[j] = t;
          }
          (me.g = function(count2) {
            var t2, r = 0, i4 = me.i, j2 = me.j, s2 = me.S;
            while (count2--) {
              t2 = s2[i4 = mask & i4 + 1];
              r = r * width + s2[mask & (s2[i4] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
            }
            me.i = i4;
            me.j = j2;
            return r;
          })(width);
        }
        function copy(f, t) {
          t.i = f.i;
          t.j = f.j;
          t.S = f.S.slice();
          return t;
        }
        ;
        function flatten3(obj, depth) {
          var result = [], typ = typeof obj, prop;
          if (depth && typ == "object") {
            for (prop in obj) {
              try {
                result.push(flatten3(obj[prop], depth - 1));
              } catch (e3) {
              }
            }
          }
          return result.length ? result : typ == "string" ? obj : obj + "\0";
        }
        function mixkey(seed, key) {
          var stringseed = seed + "", smear, j = 0;
          while (j < stringseed.length) {
            key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
          }
          return tostring(key);
        }
        function autoseed() {
          try {
            var out;
            if (nodecrypto && (out = nodecrypto.randomBytes)) {
              out = out(width);
            } else {
              out = new Uint8Array(width);
              (global.crypto || global.msCrypto).getRandomValues(out);
            }
            return tostring(out);
          } catch (e3) {
            var browser = global.navigator, plugins = browser && browser.plugins;
            return [+/* @__PURE__ */ new Date(), global, plugins, global.screen, tostring(pool)];
          }
        }
        function tostring(a) {
          return String.fromCharCode.apply(0, a);
        }
        mixkey(math2.random(), pool);
        if (typeof module == "object" && module.exports) {
          module.exports = seedrandom2;
          try {
            nodecrypto = require_crypto();
          } catch (ex) {
          }
        } else if (typeof define == "function" && define.amd) {
          define(function() {
            return seedrandom2;
          });
        } else {
          math2["seed" + rngname] = seedrandom2;
        }
      })(
        // global: `self` in browsers (including strict mode and web workers),
        // otherwise `this` in Node and other environments
        typeof self !== "undefined" ? self : exports,
        [],
        // pool: entropy pool starts empty
        Math
        // math: package containing random, pow, and seedrandom
      );
    }
  });

  // node_modules/seedrandom/index.js
  var require_seedrandom2 = __commonJS({
    "node_modules/seedrandom/index.js"(exports, module) {
      var alea = require_alea();
      var xor128 = require_xor128();
      var xorwow = require_xorwow();
      var xorshift7 = require_xorshift7();
      var xor4096 = require_xor4096();
      var tychei = require_tychei();
      var sr = require_seedrandom();
      sr.alea = alea;
      sr.xor128 = xor128;
      sr.xorwow = xorwow;
      sr.xorshift7 = xorshift7;
      sr.xor4096 = xor4096;
      sr.tychei = tychei;
      module.exports = sr;
    }
  });

  // node_modules/@viz-js/viz/lib/viz-standalone.mjs
  var A = function() {
    let A2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var I2, g2 = A2;
    g2.ready = new Promise((A3, g3) => {
      I2 = A3;
    });
    var C2, Q3, B2, E2, D2, w2, i3, o2, G2, M = (A3) => console.log(A3);
    function R(A3) {
      throw A3;
    }
    function F() {
      var A3 = G2.buffer;
      Q3 = new Int8Array(A3), B2 = new Int16Array(A3), D2 = new Uint8Array(A3), E2 = new Int32Array(A3), w2 = new Uint32Array(A3), i3 = new Float32Array(A3), o2 = new Float64Array(A3);
    }
    g2.agerrMessages = [], g2.stderrMessages = [], C2 = (A3) => g2.stderrMessages.push(A3);
    var y2 = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, K = (A3, I3, g3) => {
      for (var C3 = I3 + g3, Q4 = I3; A3[Q4] && !(Q4 >= C3); )
        ++Q4;
      if (Q4 - I3 > 16 && A3.buffer && y2)
        return y2.decode(A3.subarray(I3, Q4));
      for (var B3 = ""; I3 < Q4; ) {
        var E3 = A3[I3++];
        if (128 & E3) {
          var D3 = 63 & A3[I3++];
          if (192 != (224 & E3)) {
            var w3 = 63 & A3[I3++];
            if ((E3 = 224 == (240 & E3) ? (15 & E3) << 12 | D3 << 6 | w3 : (7 & E3) << 18 | D3 << 12 | w3 << 6 | 63 & A3[I3++]) < 65536)
              B3 += String.fromCharCode(E3);
            else {
              var i4 = E3 - 65536;
              B3 += String.fromCharCode(55296 | i4 >> 10, 56320 | 1023 & i4);
            }
          } else
            B3 += String.fromCharCode((31 & E3) << 6 | D3);
        } else
          B3 += String.fromCharCode(E3);
      }
      return B3;
    }, h = (A3, I3) => A3 ? K(D2, A3, I3) : "";
    function N(A3) {
      this.excPtr = A3, this.ptr = A3 - 24, this.set_type = function(A4) {
        w2[this.ptr + 4 >> 2] = A4;
      }, this.get_type = function() {
        return w2[this.ptr + 4 >> 2];
      }, this.set_destructor = function(A4) {
        w2[this.ptr + 8 >> 2] = A4;
      }, this.get_destructor = function() {
        return w2[this.ptr + 8 >> 2];
      }, this.set_caught = function(A4) {
        A4 = A4 ? 1 : 0, Q3[this.ptr + 12 >> 0] = A4;
      }, this.get_caught = function() {
        return 0 != Q3[this.ptr + 12 >> 0];
      }, this.set_rethrown = function(A4) {
        A4 = A4 ? 1 : 0, Q3[this.ptr + 13 >> 0] = A4;
      }, this.get_rethrown = function() {
        return 0 != Q3[this.ptr + 13 >> 0];
      }, this.init = function(A4, I3) {
        this.set_adjusted_ptr(0), this.set_type(A4), this.set_destructor(I3);
      }, this.set_adjusted_ptr = function(A4) {
        w2[this.ptr + 16 >> 2] = A4;
      }, this.get_adjusted_ptr = function() {
        return w2[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        if (l(this.get_type()))
          return w2[this.excPtr >> 2];
        var A4 = this.get_adjusted_ptr();
        return 0 !== A4 ? A4 : this.excPtr;
      };
    }
    var s = (A3) => {
      var I3 = (A3 - G2.buffer.byteLength + 65535) / 65536;
      try {
        return G2.grow(I3), F(), 1;
      } catch (A4) {
      }
    }, k = {}, L = () => {
      if (!L.strings) {
        var A3 = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
        for (var I3 in k)
          void 0 === k[I3] ? delete A3[I3] : A3[I3] = k[I3];
        var g3 = [];
        for (var I3 in A3)
          g3.push(`${I3}=${A3[I3]}`);
        L.strings = g3;
      }
      return L.strings;
    };
    var S = [null, [], []], U = (A3, I3) => {
      var g3 = S[A3];
      0 === I3 || 10 === I3 ? ((1 === A3 ? M : C2)(K(g3, 0)), g3.length = 0) : g3.push(I3);
    }, Y = (A3) => A3 % 4 == 0 && (A3 % 100 != 0 || A3 % 400 == 0), J = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], c = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], a = (A3) => {
      for (var I3 = 0, g3 = 0; g3 < A3.length; ++g3) {
        var C3 = A3.charCodeAt(g3);
        C3 <= 127 ? I3++ : C3 <= 2047 ? I3 += 2 : C3 >= 55296 && C3 <= 57343 ? (I3 += 4, ++g3) : I3 += 3;
      }
      return I3;
    }, H = (A3, I3, g3, C3) => {
      if (!(C3 > 0))
        return 0;
      for (var Q4 = g3, B3 = g3 + C3 - 1, E3 = 0; E3 < A3.length; ++E3) {
        var D3 = A3.charCodeAt(E3);
        if (D3 >= 55296 && D3 <= 57343)
          D3 = 65536 + ((1023 & D3) << 10) | 1023 & A3.charCodeAt(++E3);
        if (D3 <= 127) {
          if (g3 >= B3)
            break;
          I3[g3++] = D3;
        } else if (D3 <= 2047) {
          if (g3 + 1 >= B3)
            break;
          I3[g3++] = 192 | D3 >> 6, I3[g3++] = 128 | 63 & D3;
        } else if (D3 <= 65535) {
          if (g3 + 2 >= B3)
            break;
          I3[g3++] = 224 | D3 >> 12, I3[g3++] = 128 | D3 >> 6 & 63, I3[g3++] = 128 | 63 & D3;
        } else {
          if (g3 + 3 >= B3)
            break;
          I3[g3++] = 240 | D3 >> 18, I3[g3++] = 128 | D3 >> 12 & 63, I3[g3++] = 128 | D3 >> 6 & 63, I3[g3++] = 128 | 63 & D3;
        }
      }
      return I3[g3] = 0, g3 - Q4;
    };
    var Z = (A3, I3) => {
      Q3.set(A3, I3);
    }, q = (A3, I3, g3, C3) => {
      var Q4 = w2[C3 + 40 >> 2], B3 = { tm_sec: E2[C3 >> 2], tm_min: E2[C3 + 4 >> 2], tm_hour: E2[C3 + 8 >> 2], tm_mday: E2[C3 + 12 >> 2], tm_mon: E2[C3 + 16 >> 2], tm_year: E2[C3 + 20 >> 2], tm_wday: E2[C3 + 24 >> 2], tm_yday: E2[C3 + 28 >> 2], tm_isdst: E2[C3 + 32 >> 2], tm_gmtoff: E2[C3 + 36 >> 2], tm_zone: Q4 ? h(Q4) : "" }, D3 = h(g3), i4 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
      for (var o3 in i4)
        D3 = D3.replace(new RegExp(o3, "g"), i4[o3]);
      var G3 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], M2 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function R2(A4, I4, g4) {
        for (var C4 = "number" == typeof A4 ? A4.toString() : A4 || ""; C4.length < I4; )
          C4 = g4[0] + C4;
        return C4;
      }
      function F2(A4, I4) {
        return R2(A4, I4, "0");
      }
      function y3(A4, I4) {
        function g4(A5) {
          return A5 < 0 ? -1 : A5 > 0 ? 1 : 0;
        }
        var C4;
        return 0 === (C4 = g4(A4.getFullYear() - I4.getFullYear())) && 0 === (C4 = g4(A4.getMonth() - I4.getMonth())) && (C4 = g4(A4.getDate() - I4.getDate())), C4;
      }
      function K2(A4) {
        switch (A4.getDay()) {
          case 0:
            return new Date(A4.getFullYear() - 1, 11, 29);
          case 1:
            return A4;
          case 2:
            return new Date(A4.getFullYear(), 0, 3);
          case 3:
            return new Date(A4.getFullYear(), 0, 2);
          case 4:
            return new Date(A4.getFullYear(), 0, 1);
          case 5:
            return new Date(A4.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(A4.getFullYear() - 1, 11, 30);
        }
      }
      function N2(A4) {
        var I4 = ((A5, I5) => {
          for (var g5 = new Date(A5.getTime()); I5 > 0; ) {
            var C5 = Y(g5.getFullYear()), Q6 = g5.getMonth(), B5 = (C5 ? J : c)[Q6];
            if (!(I5 > B5 - g5.getDate()))
              return g5.setDate(g5.getDate() + I5), g5;
            I5 -= B5 - g5.getDate() + 1, g5.setDate(1), Q6 < 11 ? g5.setMonth(Q6 + 1) : (g5.setMonth(0), g5.setFullYear(g5.getFullYear() + 1));
          }
          return g5;
        })(new Date(A4.tm_year + 1900, 0, 1), A4.tm_yday), g4 = new Date(I4.getFullYear(), 0, 4), C4 = new Date(I4.getFullYear() + 1, 0, 4), Q5 = K2(g4), B4 = K2(C4);
        return y3(Q5, I4) <= 0 ? y3(B4, I4) <= 0 ? I4.getFullYear() + 1 : I4.getFullYear() : I4.getFullYear() - 1;
      }
      var s2 = { "%a": (A4) => G3[A4.tm_wday].substring(0, 3), "%A": (A4) => G3[A4.tm_wday], "%b": (A4) => M2[A4.tm_mon].substring(0, 3), "%B": (A4) => M2[A4.tm_mon], "%C": (A4) => F2((A4.tm_year + 1900) / 100 | 0, 2), "%d": (A4) => F2(A4.tm_mday, 2), "%e": (A4) => R2(A4.tm_mday, 2, " "), "%g": (A4) => N2(A4).toString().substring(2), "%G": (A4) => N2(A4), "%H": (A4) => F2(A4.tm_hour, 2), "%I": (A4) => {
        var I4 = A4.tm_hour;
        return 0 == I4 ? I4 = 12 : I4 > 12 && (I4 -= 12), F2(I4, 2);
      }, "%j": (A4) => F2(A4.tm_mday + ((A5, I4) => {
        for (var g4 = 0, C4 = 0; C4 <= I4; g4 += A5[C4++])
          ;
        return g4;
      })(Y(A4.tm_year + 1900) ? J : c, A4.tm_mon - 1), 3), "%m": (A4) => F2(A4.tm_mon + 1, 2), "%M": (A4) => F2(A4.tm_min, 2), "%n": () => "\n", "%p": (A4) => A4.tm_hour >= 0 && A4.tm_hour < 12 ? "AM" : "PM", "%S": (A4) => F2(A4.tm_sec, 2), "%t": () => "	", "%u": (A4) => A4.tm_wday || 7, "%U": (A4) => {
        var I4 = A4.tm_yday + 7 - A4.tm_wday;
        return F2(Math.floor(I4 / 7), 2);
      }, "%V": (A4) => {
        var I4 = Math.floor((A4.tm_yday + 7 - (A4.tm_wday + 6) % 7) / 7);
        if ((A4.tm_wday + 371 - A4.tm_yday - 2) % 7 <= 2 && I4++, I4) {
          if (53 == I4) {
            var g4 = (A4.tm_wday + 371 - A4.tm_yday) % 7;
            4 == g4 || 3 == g4 && Y(A4.tm_year) || (I4 = 1);
          }
        } else {
          I4 = 52;
          var C4 = (A4.tm_wday + 7 - A4.tm_yday - 1) % 7;
          (4 == C4 || 5 == C4 && Y(A4.tm_year % 400 - 1)) && I4++;
        }
        return F2(I4, 2);
      }, "%w": (A4) => A4.tm_wday, "%W": (A4) => {
        var I4 = A4.tm_yday + 7 - (A4.tm_wday + 6) % 7;
        return F2(Math.floor(I4 / 7), 2);
      }, "%y": (A4) => (A4.tm_year + 1900).toString().substring(2), "%Y": (A4) => A4.tm_year + 1900, "%z": (A4) => {
        var I4 = A4.tm_gmtoff, g4 = I4 >= 0;
        return I4 = (I4 = Math.abs(I4) / 60) / 60 * 100 + I4 % 60, (g4 ? "+" : "-") + String("0000" + I4).slice(-4);
      }, "%Z": (A4) => A4.tm_zone, "%%": () => "%" };
      for (var o3 in D3 = D3.replace(/%%/g, "\0\0"), s2)
        D3.includes(o3) && (D3 = D3.replace(new RegExp(o3, "g"), s2[o3](B3)));
      D3 = D3.replace(/\0\0/g, "%");
      var k2, L2, S2, U2, q2, d2, W2 = (k2 = D3, L2 = false, U2 = S2 > 0 ? S2 : a(k2) + 1, q2 = new Array(U2), d2 = H(k2, q2, 0, q2.length), L2 && (q2.length = d2), q2);
      return W2.length > I3 ? 0 : (Z(W2, A3), W2.length - 1);
    }, d = (A3, I3, g3) => H(A3, D2, I3, g3);
    var W = { a: (A3, I3, g3, C3) => {
      R(`Assertion failed: ${h(A3)}, at: ` + [I3 ? h(I3) : "unknown filename", g3, C3 ? h(C3) : "unknown function"]);
    }, c: (A3, I3, g3) => {
      throw new N(A3).init(I3, g3), A3;
    }, l: (A3, I3, g3, C3) => {
    }, j: function(A3, I3, g3) {
      return 0;
    }, w: (A3, I3) => {
    }, x: function(A3, I3, g3) {
      return 0;
    }, u: (A3, I3, g3, C3) => {
    }, e: function(A3, I3, g3, C3) {
    }, v: (A3, I3) => {
    }, r: (A3, I3, g3) => {
    }, k: () => true, m: function(A3, I3, g3, C3, Q4, B3, E3, D3) {
      return -52;
    }, n: function(A3, I3, g3, C3, Q4, B3, E3) {
    }, b: () => {
      R("");
    }, f: () => Date.now(), q: (A3) => {
      var I3 = D2.length, g3 = 2147483648;
      if ((A3 >>>= 0) > g3)
        return false;
      for (var C3, Q4, B3 = 1; B3 <= 4; B3 *= 2) {
        var E3 = I3 * (1 + 0.2 / B3);
        E3 = Math.min(E3, A3 + 100663296);
        var w3 = Math.min(g3, (C3 = Math.max(A3, E3)) + ((Q4 = 65536) - C3 % Q4) % Q4);
        if (s(w3))
          return true;
      }
      return false;
    }, s: (A3, I3) => {
      var g3 = 0;
      return L().forEach((C3, B3) => {
        var E3 = I3 + g3;
        w2[A3 + 4 * B3 >> 2] = E3, ((A4, I4) => {
          for (var g4 = 0; g4 < A4.length; ++g4)
            Q3[I4++ >> 0] = A4.charCodeAt(g4);
          Q3[I4 >> 0] = 0;
        })(C3, E3), g3 += C3.length + 1;
      }), 0;
    }, t: (A3, I3) => {
      var g3 = L();
      w2[A3 >> 2] = g3.length;
      var C3 = 0;
      return g3.forEach((A4) => C3 += A4.length + 1), w2[I3 >> 2] = C3, 0;
    }, g: (A3) => {
      throw `exit(${A3})`;
    }, d: (A3) => 52, h: (A3, I3, g3, C3) => 52, o: function(A3, I3, g3, C3, Q4) {
      return 70;
    }, i: (A3, I3, g3, C3) => {
      for (var Q4 = 0, B3 = 0; B3 < g3; B3++) {
        var E3 = w2[I3 >> 2], i4 = w2[I3 + 4 >> 2];
        I3 += 8;
        for (var o3 = 0; o3 < i4; o3++)
          U(A3, D2[E3 + o3]);
        Q4 += i4;
      }
      return w2[C3 >> 2] = Q4, 0;
    }, p: (A3, I3, g3, C3, Q4) => q(A3, I3, g3, C3), y: function(A3) {
      return g2.agerrMessages.push(h(A3)), 0;
    } };
    g2.ccall = (A3, I3, C3, Q4, B3) => {
      var E3 = { string: (A4) => {
        var I4 = 0;
        return null != A4 && 0 !== A4 && (I4 = ((A5) => {
          var I5 = a(A5) + 1, g3 = O(I5);
          return d(A5, g3, I5), g3;
        })(A4)), I4;
      }, array: (A4) => {
        var I4 = O(A4.length);
        return Z(A4, I4), I4;
      } };
      var D3 = ((A4) => g2["_" + A4])(A3), w3 = [], i4 = 0;
      if (Q4)
        for (var o3 = 0; o3 < Q4.length; o3++) {
          var G3 = E3[C3[o3]];
          G3 ? (0 === i4 && (i4 = b()), w3[o3] = G3(Q4[o3])) : w3[o3] = Q4[o3];
        }
      var M2 = D3.apply(null, w3);
      return M2 = function(A4) {
        return 0 !== i4 && x(i4), function(A5) {
          return "string" === I3 ? h(A5) : "boolean" === I3 ? Boolean(A5) : A5;
        }(A4);
      }(M2);
    }, g2.getValue = function(A3) {
      let I3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "i8";
      switch (I3.endsWith("*") && (I3 = "*"), I3) {
        case "i1":
        case "i8":
          return Q3[A3 >> 0];
        case "i16":
          return B2[A3 >> 1];
        case "i32":
          return E2[A3 >> 2];
        case "i64":
          R("to do getValue(i64) use WASM_BIGINT");
        case "float":
          return i3[A3 >> 2];
        case "double":
          return o2[A3 >> 3];
        case "*":
          return w2[A3 >> 2];
        default:
          R(`invalid type for getValue: ${I3}`);
      }
    }, g2.UTF8ToString = h, g2.stringToUTF8 = d, g2.lengthBytesUTF8 = a;
    var b, x, O, l, m = { a: W };
    return WebAssembly.instantiate(g2.wasm, m).then((A3) => {
      var C3 = A3.instance.exports;
      g2._viz_set_y_invert = C3.B, g2._viz_set_reduce = C3.C, g2._viz_get_graphviz_version = C3.D, g2._viz_get_plugin_list = C3.E, g2._viz_create_graph = C3.F, g2._viz_read_one_graph = C3.G, g2._viz_string_dup = C3.H, g2._viz_string_dup_html = C3.I, g2._viz_string_free = C3.J, g2._viz_add_node = C3.K, g2._viz_add_edge = C3.L, g2._viz_add_subgraph = C3.M, g2._viz_set_default_graph_attribute = C3.N, g2._viz_set_default_node_attribute = C3.O, g2._viz_set_default_edge_attribute = C3.P, g2._viz_set_attribute = C3.Q, g2._viz_free_graph = C3.R, g2._viz_render_graph = C3.S, g2._free = C3.U, g2._malloc = C3.V, b = C3.W, x = C3.X, O = C3.Y, l = C3.Z, C3.T, G2 = C3.z, F(), function(A4) {
        A4.A();
      }(C3), I2(g2);
    }), A2.ready;
  };
  var I = [[/^Error: (.*)/, "error"], [/^Warning: (.*)/, "warning"]];
  function g(A2) {
    return function(A3) {
      const I2 = [];
      let g2;
      for (let C2 = 0; C2 < A3.length; C2++)
        "Error" == A3[C2] && ": " == A3[C2 + 1] ? (g2 = "error", C2 += 1) : "Warning" == A3[C2] && ": " == A3[C2 + 1] ? (g2 = "warning", C2 += 1) : I2.push({ message: A3[C2].trimEnd(), level: g2 });
      return I2;
    }(A2.agerrMessages).concat(A2.stderrMessages.map((A3) => {
      for (let g2 = 0; g2 < I.length; g2++) {
        const [C2, Q3] = I[g2];
        let B2;
        if (null !== (B2 = C2.exec(A3)))
          return { message: B2[1].trimEnd(), level: Q3 };
      }
      return { message: A3.trimEnd() };
    }));
  }
  function C(A2, I2, g2, C2) {
    let Q3;
    if (Q3 = "object" == typeof g2 && "html" in g2 ? A2.ccall("viz_string_dup_html", "number", ["number", "string"], [I2, String(g2.html)]) : A2.ccall("viz_string_dup", "number", ["number", "string"], [I2, String(g2)]), 0 == Q3)
      throw new Error("couldn't dup string");
    C2(Q3), A2.ccall("viz_string_free", "number", ["number", "number"], [I2, Q3]);
  }
  function Q(A2, I2, g2) {
    if (g2.graphAttributes)
      for (const [Q3, B2] of Object.entries(g2.graphAttributes))
        C(A2, I2, B2, (g3) => {
          A2.ccall("viz_set_default_graph_attribute", "number", ["number", "string", "number"], [I2, Q3, g3]);
        });
    if (g2.nodeAttributes)
      for (const [Q3, B2] of Object.entries(g2.nodeAttributes))
        C(A2, I2, B2, (g3) => {
          A2.ccall("viz_set_default_node_attribute", "number", ["number", "string", "number"], [I2, Q3, g3]);
        });
    if (g2.edgeAttributes)
      for (const [Q3, B2] of Object.entries(g2.edgeAttributes))
        C(A2, I2, B2, (g3) => {
          A2.ccall("viz_set_default_edge_attribute", "number", ["number", "string", "number"], [I2, Q3, g3]);
        });
  }
  function B(A2, I2, g2, Q3) {
    for (const [B2, E2] of Object.entries(Q3))
      C(A2, I2, E2, (I3) => {
        A2.ccall("viz_set_attribute", "number", ["number", "string", "number"], [g2, B2, I3]);
      });
  }
  function E(A2, I2, g2) {
    Q(A2, I2, g2), g2.nodes && g2.nodes.forEach((g3) => {
      const C2 = A2.ccall("viz_add_node", "number", ["number", "string"], [I2, String(g3.name)]);
      g3.attributes && B(A2, I2, C2, g3.attributes);
    }), g2.edges && g2.edges.forEach((g3) => {
      const C2 = A2.ccall("viz_add_edge", "number", ["number", "string", "string"], [I2, String(g3.tail), String(g3.head)]);
      g3.attributes && B(A2, I2, C2, g3.attributes);
    }), g2.subgraphs && g2.subgraphs.forEach((g3) => {
      const C2 = A2.ccall("viz_add_subgraph", "number", ["number", "string"], [I2, String(g3.name)]);
      E(A2, C2, g3);
    });
  }
  function D(A2, I2, g2) {
    const C2 = A2.ccall("viz_create_graph", "number", ["string", "number", "number"], [I2.name, void 0 === I2.directed || I2.directed, void 0 !== I2.strict && I2.strict]);
    return E(A2, C2, I2), C2;
  }
  function w(A2, I2) {
    const g2 = A2.ccall("viz_get_plugin_list", "number", ["string"], [I2]);
    if (0 == g2)
      throw new Error(`couldn't get plugin list: ${I2}`);
    const C2 = [];
    let Q3, B2 = g2;
    for (; Q3 = A2.getValue(B2, "*"); )
      C2.push(A2.UTF8ToString(Q3)), A2.ccall("free", "number", ["number"], [Q3]), B2 += 4;
    return A2.ccall("free", "number", ["number"], [g2]), C2;
  }
  var i = class {
    constructor(A2) {
      this.module = A2;
    }
    get graphvizVersion() {
      return function(A2) {
        const I2 = A2.ccall("viz_get_graphviz_version", "number", [], []);
        return A2.UTF8ToString(I2);
      }(this.module);
    }
    get formats() {
      return w(this.module, "device");
    }
    get engines() {
      return w(this.module, "layout");
    }
    render(A2) {
      let I2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return function(A3, I3, C2) {
        let B2, E2;
        try {
          if (A3.agerrMessages = [], A3.stderrMessages = [], "string" == typeof I3)
            B2 = function(A4, I4, g2) {
              let C3;
              try {
                const g3 = A4.lengthBytesUTF8(I4);
                return C3 = A4.ccall("malloc", "number", ["number"], [g3 + 1]), A4.stringToUTF8(I4, C3, g3 + 1), A4.ccall("viz_read_one_graph", "number", ["number"], [C3]);
              } finally {
                C3 && A4.ccall("free", "number", ["number"], [C3]);
              }
            }(A3, I3);
          else {
            if ("object" != typeof I3)
              throw new Error("input must be a string or object");
            B2 = D(A3, I3);
          }
          return 0 === B2 ? { status: "failure", output: void 0, errors: g(A3) } : (Q(A3, B2, C2), A3.ccall("viz_set_y_invert", "number", ["number"], [C2.yInvert ? 1 : 0]), A3.ccall("viz_set_reduce", "number", ["number"], [C2.reduce ? 1 : 0]), E2 = A3.ccall("viz_render_graph", "number", ["number", "string", "string"], [B2, C2.format, C2.engine]), 0 === E2 ? { status: "failure", output: void 0, errors: g(A3) } : { status: "success", output: A3.UTF8ToString(E2), errors: g(A3) });
        } catch (I4) {
          if (/^exit\(\d+\)/.test(I4))
            return { status: "failure", output: void 0, errors: g(A3) };
          throw I4;
        } finally {
          B2 && A3.ccall("viz_free_graph", "number", ["number"], [B2]), E2 && A3.ccall("free", "number", ["number"], [E2]);
        }
      }(this.module, A2, { format: "dot", engine: "dot", ...I2 });
    }
    renderString(A2) {
      let I2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const g2 = this.render(A2, I2);
      if ("success" !== g2.status)
        throw new Error(g2.errors.find((A3) => "error" == A3.level)?.message || "render failed");
      return g2.output;
    }
    renderSVGElement(A2) {
      let I2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const g2 = this.renderString(A2, { ...I2, format: "svg" });
      return new DOMParser().parseFromString(g2, "image/svg+xml").documentElement;
    }
    renderJSON(A2) {
      let I2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      const g2 = this.renderString(A2, { ...I2, format: "json" });
      return JSON.parse(g2);
    }
  };
  function G() {
    const A2 = atob(o), I2 = new Uint8Array(A2.length);
    for (let g2 = 0; g2 < A2.length; g2++)
      I2[g2] = A2.charCodeAt(g2);
    return I2.buffer;
  }
  function y() {
    return A({ wasm: G() }).then((A2) => new i(A2));
  }

  // node_modules/@babel/runtime/helpers/esm/extends.js
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  // node_modules/mathjs/lib/esm/core/config.js
  var DEFAULT_CONFIG = {
    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-12,
    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: "Matrix",
    // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
    number: "number",
    // number of significant digits in BigNumbers
    precision: 64,
    // predictable output type of functions. When true, output type depends only
    // on the input types. When false (default), output type can vary depending
    // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
    // predictable is false, and returns `NaN` when true.
    predictable: false,
    // random seed for seeded pseudo random number generation
    // null = randomly seed
    randomSeed: null
  };

  // node_modules/mathjs/lib/esm/utils/is.js
  function isNumber(x) {
    return typeof x === "number";
  }
  function isBigNumber(x) {
    if (!x || typeof x !== "object" || typeof x.constructor !== "function") {
      return false;
    }
    if (x.isBigNumber === true && typeof x.constructor.prototype === "object" && x.constructor.prototype.isBigNumber === true) {
      return true;
    }
    if (typeof x.constructor.isDecimal === "function" && x.constructor.isDecimal(x) === true) {
      return true;
    }
    return false;
  }
  function isComplex(x) {
    return x && typeof x === "object" && Object.getPrototypeOf(x).isComplex === true || false;
  }
  function isFraction(x) {
    return x && typeof x === "object" && Object.getPrototypeOf(x).isFraction === true || false;
  }
  function isUnit(x) {
    return x && x.constructor.prototype.isUnit === true || false;
  }
  function isString(x) {
    return typeof x === "string";
  }
  var isArray = Array.isArray;
  function isMatrix(x) {
    return x && x.constructor.prototype.isMatrix === true || false;
  }
  function isCollection(x) {
    return Array.isArray(x) || isMatrix(x);
  }
  function isDenseMatrix(x) {
    return x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true || false;
  }
  function isSparseMatrix(x) {
    return x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true || false;
  }
  function isRange(x) {
    return x && x.constructor.prototype.isRange === true || false;
  }
  function isIndex(x) {
    return x && x.constructor.prototype.isIndex === true || false;
  }
  function isBoolean(x) {
    return typeof x === "boolean";
  }
  function isResultSet(x) {
    return x && x.constructor.prototype.isResultSet === true || false;
  }
  function isHelp(x) {
    return x && x.constructor.prototype.isHelp === true || false;
  }
  function isFunction(x) {
    return typeof x === "function";
  }
  function isDate(x) {
    return x instanceof Date;
  }
  function isRegExp(x) {
    return x instanceof RegExp;
  }
  function isObject(x) {
    return !!(x && typeof x === "object" && x.constructor === Object && !isComplex(x) && !isFraction(x));
  }
  function isNull(x) {
    return x === null;
  }
  function isUndefined(x) {
    return x === void 0;
  }
  function isAccessorNode(x) {
    return x && x.isAccessorNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isArrayNode(x) {
    return x && x.isArrayNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isAssignmentNode(x) {
    return x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isBlockNode(x) {
    return x && x.isBlockNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isConditionalNode(x) {
    return x && x.isConditionalNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isConstantNode(x) {
    return x && x.isConstantNode === true && x.constructor.prototype.isNode === true || false;
  }
  function rule2Node(node) {
    return isConstantNode(node) || isOperatorNode(node) && node.args.length === 1 && isConstantNode(node.args[0]) && "-+~".includes(node.op);
  }
  function isFunctionAssignmentNode(x) {
    return x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isFunctionNode(x) {
    return x && x.isFunctionNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isIndexNode(x) {
    return x && x.isIndexNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isNode(x) {
    return x && x.isNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isObjectNode(x) {
    return x && x.isObjectNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isOperatorNode(x) {
    return x && x.isOperatorNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isParenthesisNode(x) {
    return x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isRangeNode(x) {
    return x && x.isRangeNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isRelationalNode(x) {
    return x && x.isRelationalNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isSymbolNode(x) {
    return x && x.isSymbolNode === true && x.constructor.prototype.isNode === true || false;
  }
  function isChain(x) {
    return x && x.constructor.prototype.isChain === true || false;
  }
  function typeOf(x) {
    var t = typeof x;
    if (t === "object") {
      if (x === null)
        return "null";
      if (isBigNumber(x))
        return "BigNumber";
      if (x.constructor && x.constructor.name)
        return x.constructor.name;
      return "Object";
    }
    return t;
  }

  // node_modules/mathjs/lib/esm/utils/object.js
  function clone(x) {
    var type = typeof x;
    if (type === "number" || type === "string" || type === "boolean" || x === null || x === void 0) {
      return x;
    }
    if (typeof x.clone === "function") {
      return x.clone();
    }
    if (Array.isArray(x)) {
      return x.map(function(value) {
        return clone(value);
      });
    }
    if (x instanceof Date)
      return new Date(x.valueOf());
    if (isBigNumber(x))
      return x;
    if (isObject(x)) {
      return mapObject(x, clone);
    }
    throw new TypeError("Cannot clone: unknown type of value (value: ".concat(x, ")"));
  }
  function mapObject(object, callback) {
    var clone5 = {};
    for (var key in object) {
      if (hasOwnProperty(object, key)) {
        clone5[key] = callback(object[key]);
      }
    }
    return clone5;
  }
  function extend(a, b) {
    for (var prop in b) {
      if (hasOwnProperty(b, prop)) {
        a[prop] = b[prop];
      }
    }
    return a;
  }
  function deepStrictEqual(a, b) {
    var prop, i3, len;
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (i3 = 0, len = a.length; i3 < len; i3++) {
        if (!deepStrictEqual(a[i3], b[i3])) {
          return false;
        }
      }
      return true;
    } else if (typeof a === "function") {
      return a === b;
    } else if (a instanceof Object) {
      if (Array.isArray(b) || !(b instanceof Object)) {
        return false;
      }
      for (prop in a) {
        if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
          return false;
        }
      }
      for (prop in b) {
        if (!(prop in a)) {
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  }
  function lazy(object, prop, valueResolver) {
    var _uninitialized = true;
    var _value;
    Object.defineProperty(object, prop, {
      get: function get() {
        if (_uninitialized) {
          _value = valueResolver();
          _uninitialized = false;
        }
        return _value;
      },
      set: function set(value) {
        _value = value;
        _uninitialized = false;
      },
      configurable: true,
      enumerable: true
    });
  }
  function hasOwnProperty(object, property) {
    return object && Object.hasOwnProperty.call(object, property);
  }
  function pickShallow(object, properties2) {
    var copy = {};
    for (var i3 = 0; i3 < properties2.length; i3++) {
      var key = properties2[i3];
      var value = object[key];
      if (value !== void 0) {
        copy[key] = value;
      }
    }
    return copy;
  }

  // node_modules/mathjs/lib/esm/core/function/config.js
  var MATRIX_OPTIONS = ["Matrix", "Array"];
  var NUMBER_OPTIONS = ["number", "BigNumber", "Fraction"];

  // node_modules/mathjs/lib/esm/entry/configReadonly.js
  var config = function config2(options) {
    if (options) {
      throw new Error("The global config is readonly. \nPlease create a mathjs instance if you want to change the default configuration. \nExample:\n\n  import { create, all } from 'mathjs';\n  const mathjs = create(all);\n  mathjs.config({ number: 'BigNumber' });\n");
    }
    return Object.freeze(DEFAULT_CONFIG);
  };
  _extends(config, DEFAULT_CONFIG, {
    MATRIX_OPTIONS,
    NUMBER_OPTIONS
  });

  // node_modules/mathjs/lib/esm/core/function/typed.js
  var import_typed_function = __toESM(require_typed_function(), 1);

  // node_modules/mathjs/lib/esm/utils/number.js
  function isInteger(value) {
    if (typeof value === "boolean") {
      return true;
    }
    return isFinite(value) ? value === Math.round(value) : false;
  }
  var sign = Math.sign || function(x) {
    if (x > 0) {
      return 1;
    } else if (x < 0) {
      return -1;
    } else {
      return 0;
    }
  };
  var log2 = Math.log2 || function log22(x) {
    return Math.log(x) / Math.LN2;
  };
  var log10 = Math.log10 || function log102(x) {
    return Math.log(x) / Math.LN10;
  };
  var log1p = Math.log1p || function(x) {
    return Math.log(x + 1);
  };
  var cbrt = Math.cbrt || function cbrt2(x) {
    if (x === 0) {
      return x;
    }
    var negate = x < 0;
    var result;
    if (negate) {
      x = -x;
    }
    if (isFinite(x)) {
      result = Math.exp(Math.log(x) / 3);
      result = (x / (result * result) + 2 * result) / 3;
    } else {
      result = x;
    }
    return negate ? -result : result;
  };
  var expm1 = Math.expm1 || function expm12(x) {
    return x >= 2e-4 || x <= -2e-4 ? Math.exp(x) - 1 : x + x * x / 2 + x * x * x / 6;
  };
  function formatNumberToBase(n, base, size2) {
    var prefixes = {
      2: "0b",
      8: "0o",
      16: "0x"
    };
    var prefix = prefixes[base];
    var suffix = "";
    if (size2) {
      if (size2 < 1) {
        throw new Error("size must be in greater than 0");
      }
      if (!isInteger(size2)) {
        throw new Error("size must be an integer");
      }
      if (n > 2 ** (size2 - 1) - 1 || n < -(2 ** (size2 - 1))) {
        throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
      }
      if (!isInteger(n)) {
        throw new Error("Value must be an integer");
      }
      if (n < 0) {
        n = n + 2 ** size2;
      }
      suffix = "i".concat(size2);
    }
    var sign4 = "";
    if (n < 0) {
      n = -n;
      sign4 = "-";
    }
    return "".concat(sign4).concat(prefix).concat(n.toString(base)).concat(suffix);
  }
  function format(value, options) {
    if (typeof options === "function") {
      return options(value);
    }
    if (value === Infinity) {
      return "Infinity";
    } else if (value === -Infinity) {
      return "-Infinity";
    } else if (isNaN(value)) {
      return "NaN";
    }
    var notation = "auto";
    var precision;
    var wordSize;
    if (options) {
      if (options.notation) {
        notation = options.notation;
      }
      if (isNumber(options)) {
        precision = options;
      } else if (isNumber(options.precision)) {
        precision = options.precision;
      }
      if (options.wordSize) {
        wordSize = options.wordSize;
        if (typeof wordSize !== "number") {
          throw new Error('Option "wordSize" must be a number');
        }
      }
    }
    switch (notation) {
      case "fixed":
        return toFixed(value, precision);
      case "exponential":
        return toExponential(value, precision);
      case "engineering":
        return toEngineering(value, precision);
      case "bin":
        return formatNumberToBase(value, 2, wordSize);
      case "oct":
        return formatNumberToBase(value, 8, wordSize);
      case "hex":
        return formatNumberToBase(value, 16, wordSize);
      case "auto":
        return toPrecision(value, precision, options && options).replace(/((\.\d*?)(0+))($|e)/, function() {
          var digits2 = arguments[2];
          var e3 = arguments[4];
          return digits2 !== "." ? digits2 + e3 : e3;
        });
      default:
        throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
    }
  }
  function splitNumber(value) {
    var match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
    if (!match) {
      throw new SyntaxError("Invalid number " + value);
    }
    var sign4 = match[1];
    var digits2 = match[2];
    var exponent = parseFloat(match[4] || "0");
    var dot2 = digits2.indexOf(".");
    exponent += dot2 !== -1 ? dot2 - 1 : digits2.length - 1;
    var coefficients = digits2.replace(".", "").replace(/^0*/, function(zeros3) {
      exponent -= zeros3.length;
      return "";
    }).replace(/0*$/, "").split("").map(function(d) {
      return parseInt(d);
    });
    if (coefficients.length === 0) {
      coefficients.push(0);
      exponent++;
    }
    return {
      sign: sign4,
      coefficients,
      exponent
    };
  }
  function toEngineering(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
      return String(value);
    }
    var split = splitNumber(value);
    var rounded = roundDigits(split, precision);
    var e3 = rounded.exponent;
    var c = rounded.coefficients;
    var newExp = e3 % 3 === 0 ? e3 : e3 < 0 ? e3 - 3 - e3 % 3 : e3 - e3 % 3;
    if (isNumber(precision)) {
      while (precision > c.length || e3 - newExp + 1 > c.length) {
        c.push(0);
      }
    } else {
      var missingZeros = Math.abs(e3 - newExp) - (c.length - 1);
      for (var i3 = 0; i3 < missingZeros; i3++) {
        c.push(0);
      }
    }
    var expDiff = Math.abs(e3 - newExp);
    var decimalIdx = 1;
    while (expDiff > 0) {
      decimalIdx++;
      expDiff--;
    }
    var decimals = c.slice(decimalIdx).join("");
    var decimalVal = isNumber(precision) && decimals.length || decimals.match(/[1-9]/) ? "." + decimals : "";
    var str = c.slice(0, decimalIdx).join("") + decimalVal + "e" + (e3 >= 0 ? "+" : "") + newExp.toString();
    return rounded.sign + str;
  }
  function toFixed(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
      return String(value);
    }
    var splitValue = splitNumber(value);
    var rounded = typeof precision === "number" ? roundDigits(splitValue, splitValue.exponent + 1 + precision) : splitValue;
    var c = rounded.coefficients;
    var p = rounded.exponent + 1;
    var pp = p + (precision || 0);
    if (c.length < pp) {
      c = c.concat(zeros(pp - c.length));
    }
    if (p < 0) {
      c = zeros(-p + 1).concat(c);
      p = 1;
    }
    if (p < c.length) {
      c.splice(p, 0, p === 0 ? "0." : ".");
    }
    return rounded.sign + c.join("");
  }
  function toExponential(value, precision) {
    if (isNaN(value) || !isFinite(value)) {
      return String(value);
    }
    var split = splitNumber(value);
    var rounded = precision ? roundDigits(split, precision) : split;
    var c = rounded.coefficients;
    var e3 = rounded.exponent;
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }
    var first = c.shift();
    return rounded.sign + first + (c.length > 0 ? "." + c.join("") : "") + "e" + (e3 >= 0 ? "+" : "") + e3;
  }
  function toPrecision(value, precision, options) {
    if (isNaN(value) || !isFinite(value)) {
      return String(value);
    }
    var lowerExp = options && options.lowerExp !== void 0 ? options.lowerExp : -3;
    var upperExp = options && options.upperExp !== void 0 ? options.upperExp : 5;
    var split = splitNumber(value);
    var rounded = precision ? roundDigits(split, precision) : split;
    if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
      return toExponential(value, precision);
    } else {
      var c = rounded.coefficients;
      var e3 = rounded.exponent;
      if (c.length < precision) {
        c = c.concat(zeros(precision - c.length));
      }
      c = c.concat(zeros(e3 - c.length + 1 + (c.length < precision ? precision - c.length : 0)));
      c = zeros(-e3).concat(c);
      var dot2 = e3 > 0 ? e3 : 0;
      if (dot2 < c.length - 1) {
        c.splice(dot2 + 1, 0, ".");
      }
      return rounded.sign + c.join("");
    }
  }
  function roundDigits(split, precision) {
    var rounded = {
      sign: split.sign,
      coefficients: split.coefficients,
      exponent: split.exponent
    };
    var c = rounded.coefficients;
    while (precision <= 0) {
      c.unshift(0);
      rounded.exponent++;
      precision++;
    }
    if (c.length > precision) {
      var removed = c.splice(precision, c.length - precision);
      if (removed[0] >= 5) {
        var i3 = precision - 1;
        c[i3]++;
        while (c[i3] === 10) {
          c.pop();
          if (i3 === 0) {
            c.unshift(0);
            rounded.exponent++;
            i3++;
          }
          i3--;
          c[i3]++;
        }
      }
    }
    return rounded;
  }
  function zeros(length) {
    var arr = [];
    for (var i3 = 0; i3 < length; i3++) {
      arr.push(0);
    }
    return arr;
  }
  function digits(value) {
    return value.toExponential().replace(/e.*$/, "").replace(/^0\.?0*|\./, "").length;
  }
  var DBL_EPSILON = Number.EPSILON || 2220446049250313e-31;
  function nearlyEqual(x, y2, epsilon) {
    if (epsilon === null || epsilon === void 0) {
      return x === y2;
    }
    if (x === y2) {
      return true;
    }
    if (isNaN(x) || isNaN(y2)) {
      return false;
    }
    if (isFinite(x) && isFinite(y2)) {
      var diff2 = Math.abs(x - y2);
      if (diff2 <= DBL_EPSILON) {
        return true;
      } else {
        return diff2 <= Math.max(Math.abs(x), Math.abs(y2)) * epsilon;
      }
    }
    return false;
  }
  var acosh = Math.acosh || function(x) {
    return Math.log(Math.sqrt(x * x - 1) + x);
  };
  var asinh = Math.asinh || function(x) {
    return Math.log(Math.sqrt(x * x + 1) + x);
  };
  var atanh = Math.atanh || function(x) {
    return Math.log((1 + x) / (1 - x)) / 2;
  };
  var cosh = Math.cosh || function(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  };
  var sinh = Math.sinh || function(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  };
  var tanh = Math.tanh || function(x) {
    var e3 = Math.exp(2 * x);
    return (e3 - 1) / (e3 + 1);
  };
  function copysign(x, y2) {
    var signx = x > 0 ? true : x < 0 ? false : 1 / x === Infinity;
    var signy = y2 > 0 ? true : y2 < 0 ? false : 1 / y2 === Infinity;
    return signx ^ signy ? -x : x;
  }

  // node_modules/mathjs/lib/esm/utils/bignumber/formatter.js
  function formatBigNumberToBase(n, base, size2) {
    var BigNumberCtor = n.constructor;
    var big2 = new BigNumberCtor(2);
    var suffix = "";
    if (size2) {
      if (size2 < 1) {
        throw new Error("size must be in greater than 0");
      }
      if (!isInteger(size2)) {
        throw new Error("size must be an integer");
      }
      if (n.greaterThan(big2.pow(size2 - 1).sub(1)) || n.lessThan(big2.pow(size2 - 1).mul(-1))) {
        throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
      }
      if (!n.isInteger()) {
        throw new Error("Value must be an integer");
      }
      if (n.lessThan(0)) {
        n = n.add(big2.pow(size2));
      }
      suffix = "i".concat(size2);
    }
    switch (base) {
      case 2:
        return "".concat(n.toBinary()).concat(suffix);
      case 8:
        return "".concat(n.toOctal()).concat(suffix);
      case 16:
        return "".concat(n.toHexadecimal()).concat(suffix);
      default:
        throw new Error("Base ".concat(base, " not supported "));
    }
  }
  function format2(value, options) {
    if (typeof options === "function") {
      return options(value);
    }
    if (!value.isFinite()) {
      return value.isNaN() ? "NaN" : value.gt(0) ? "Infinity" : "-Infinity";
    }
    var notation = "auto";
    var precision;
    var wordSize;
    if (options !== void 0) {
      if (options.notation) {
        notation = options.notation;
      }
      if (typeof options === "number") {
        precision = options;
      } else if (options.precision !== void 0) {
        precision = options.precision;
      }
      if (options.wordSize) {
        wordSize = options.wordSize;
        if (typeof wordSize !== "number") {
          throw new Error('Option "wordSize" must be a number');
        }
      }
    }
    switch (notation) {
      case "fixed":
        return toFixed2(value, precision);
      case "exponential":
        return toExponential2(value, precision);
      case "engineering":
        return toEngineering2(value, precision);
      case "bin":
        return formatBigNumberToBase(value, 2, wordSize);
      case "oct":
        return formatBigNumberToBase(value, 8, wordSize);
      case "hex":
        return formatBigNumberToBase(value, 16, wordSize);
      case "auto": {
        var lowerExp = options && options.lowerExp !== void 0 ? options.lowerExp : -3;
        var upperExp = options && options.upperExp !== void 0 ? options.upperExp : 5;
        if (value.isZero())
          return "0";
        var str;
        var rounded = value.toSignificantDigits(precision);
        var exp3 = rounded.e;
        if (exp3 >= lowerExp && exp3 < upperExp) {
          str = rounded.toFixed();
        } else {
          str = toExponential2(value, precision);
        }
        return str.replace(/((\.\d*?)(0+))($|e)/, function() {
          var digits2 = arguments[2];
          var e3 = arguments[4];
          return digits2 !== "." ? digits2 + e3 : e3;
        });
      }
      default:
        throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
    }
  }
  function toEngineering2(value, precision) {
    var e3 = value.e;
    var newExp = e3 % 3 === 0 ? e3 : e3 < 0 ? e3 - 3 - e3 % 3 : e3 - e3 % 3;
    var valueWithoutExp = value.mul(Math.pow(10, -newExp));
    var valueStr = valueWithoutExp.toPrecision(precision);
    if (valueStr.indexOf("e") !== -1) {
      var BigNumber2 = value.constructor;
      valueStr = new BigNumber2(valueStr).toFixed();
    }
    return valueStr + "e" + (e3 >= 0 ? "+" : "") + newExp.toString();
  }
  function toExponential2(value, precision) {
    if (precision !== void 0) {
      return value.toExponential(precision - 1);
    } else {
      return value.toExponential();
    }
  }
  function toFixed2(value, precision) {
    return value.toFixed(precision);
  }

  // node_modules/mathjs/lib/esm/utils/string.js
  function endsWith(text, search) {
    var start = text.length - search.length;
    var end = text.length;
    return text.substring(start, end) === search;
  }
  function format3(value, options) {
    var result = _format(value, options);
    if (options && typeof options === "object" && "truncate" in options && result.length > options.truncate) {
      return result.substring(0, options.truncate - 3) + "...";
    }
    return result;
  }
  function _format(value, options) {
    if (typeof value === "number") {
      return format(value, options);
    }
    if (isBigNumber(value)) {
      return format2(value, options);
    }
    if (looksLikeFraction(value)) {
      if (!options || options.fraction !== "decimal") {
        return value.s * value.n + "/" + value.d;
      } else {
        return value.toString();
      }
    }
    if (Array.isArray(value)) {
      return formatArray(value, options);
    }
    if (isString(value)) {
      return stringify(value);
    }
    if (typeof value === "function") {
      return value.syntax ? String(value.syntax) : "function";
    }
    if (value && typeof value === "object") {
      if (typeof value.format === "function") {
        return value.format(options);
      } else if (value && value.toString(options) !== {}.toString()) {
        return value.toString(options);
      } else {
        var entries = Object.keys(value).map((key) => {
          return stringify(key) + ": " + format3(value[key], options);
        });
        return "{" + entries.join(", ") + "}";
      }
    }
    return String(value);
  }
  function stringify(value) {
    var text = String(value);
    var escaped = "";
    var i3 = 0;
    while (i3 < text.length) {
      var c = text.charAt(i3);
      escaped += c in controlCharacters ? controlCharacters[c] : c;
      i3++;
    }
    return '"' + escaped + '"';
  }
  var controlCharacters = {
    '"': '\\"',
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t"
  };
  function escape(value) {
    var text = String(value);
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return text;
  }
  function formatArray(array, options) {
    if (Array.isArray(array)) {
      var str = "[";
      var len = array.length;
      for (var i3 = 0; i3 < len; i3++) {
        if (i3 !== 0) {
          str += ", ";
        }
        str += formatArray(array[i3], options);
      }
      str += "]";
      return str;
    } else {
      return format3(array, options);
    }
  }
  function looksLikeFraction(value) {
    return value && typeof value === "object" && typeof value.s === "number" && typeof value.n === "number" && typeof value.d === "number" || false;
  }
  function compareText(x, y2) {
    if (!isString(x)) {
      throw new TypeError("Unexpected type of argument in function compareText (expected: string or Array or Matrix, actual: " + typeOf(x) + ", index: 0)");
    }
    if (!isString(y2)) {
      throw new TypeError("Unexpected type of argument in function compareText (expected: string or Array or Matrix, actual: " + typeOf(y2) + ", index: 1)");
    }
    return x === y2 ? 0 : x > y2 ? 1 : -1;
  }

  // node_modules/mathjs/lib/esm/error/DimensionError.js
  function DimensionError(actual, expected, relation) {
    if (!(this instanceof DimensionError)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    this.actual = actual;
    this.expected = expected;
    this.relation = relation;
    this.message = "Dimension mismatch (" + (Array.isArray(actual) ? "[" + actual.join(", ") + "]" : actual) + " " + (this.relation || "!=") + " " + (Array.isArray(expected) ? "[" + expected.join(", ") + "]" : expected) + ")";
    this.stack = new Error().stack;
  }
  DimensionError.prototype = new RangeError();
  DimensionError.prototype.constructor = RangeError;
  DimensionError.prototype.name = "DimensionError";
  DimensionError.prototype.isDimensionError = true;

  // node_modules/mathjs/lib/esm/error/IndexError.js
  function IndexError(index2, min3, max3) {
    if (!(this instanceof IndexError)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    this.index = index2;
    if (arguments.length < 3) {
      this.min = 0;
      this.max = min3;
    } else {
      this.min = min3;
      this.max = max3;
    }
    if (this.min !== void 0 && this.index < this.min) {
      this.message = "Index out of range (" + this.index + " < " + this.min + ")";
    } else if (this.max !== void 0 && this.index >= this.max) {
      this.message = "Index out of range (" + this.index + " > " + (this.max - 1) + ")";
    } else {
      this.message = "Index out of range (" + this.index + ")";
    }
    this.stack = new Error().stack;
  }
  IndexError.prototype = new RangeError();
  IndexError.prototype.constructor = RangeError;
  IndexError.prototype.name = "IndexError";
  IndexError.prototype.isIndexError = true;

  // node_modules/mathjs/lib/esm/utils/array.js
  function arraySize(x) {
    var s = [];
    while (Array.isArray(x)) {
      s.push(x.length);
      x = x[0];
    }
    return s;
  }
  function _validate(array, size2, dim) {
    var i3;
    var len = array.length;
    if (len !== size2[dim]) {
      throw new DimensionError(len, size2[dim]);
    }
    if (dim < size2.length - 1) {
      var dimNext = dim + 1;
      for (i3 = 0; i3 < len; i3++) {
        var child = array[i3];
        if (!Array.isArray(child)) {
          throw new DimensionError(size2.length - 1, size2.length, "<");
        }
        _validate(array[i3], size2, dimNext);
      }
    } else {
      for (i3 = 0; i3 < len; i3++) {
        if (Array.isArray(array[i3])) {
          throw new DimensionError(size2.length + 1, size2.length, ">");
        }
      }
    }
  }
  function validate(array, size2) {
    var isScalar = size2.length === 0;
    if (isScalar) {
      if (Array.isArray(array)) {
        throw new DimensionError(array.length, 0);
      }
    } else {
      _validate(array, size2, 0);
    }
  }
  function validateIndexSourceSize(value, index2) {
    var valueSize = value.isMatrix ? value._size : arraySize(value);
    var sourceSize = index2._sourceSize;
    sourceSize.forEach((sourceDim, i3) => {
      if (sourceDim !== null && sourceDim !== valueSize[i3]) {
        throw new DimensionError(sourceDim, valueSize[i3]);
      }
    });
  }
  function validateIndex(index2, length) {
    if (index2 !== void 0) {
      if (!isNumber(index2) || !isInteger(index2)) {
        throw new TypeError("Index must be an integer (value: " + index2 + ")");
      }
      if (index2 < 0 || typeof length === "number" && index2 >= length) {
        throw new IndexError(index2, length);
      }
    }
  }
  function isEmptyIndex(index2) {
    for (var i3 = 0; i3 < index2._dimensions.length; ++i3) {
      var dimension = index2._dimensions[i3];
      if (dimension._data && isArray(dimension._data)) {
        if (dimension._size[0] === 0) {
          return true;
        }
      } else if (dimension.isRange) {
        if (dimension.start === dimension.end) {
          return true;
        }
      } else if (isString(dimension)) {
        if (dimension.length === 0) {
          return true;
        }
      }
    }
    return false;
  }
  function resize(array, size2, defaultValue) {
    if (!Array.isArray(size2)) {
      throw new TypeError("Array expected");
    }
    if (size2.length === 0) {
      throw new Error("Resizing to scalar is not supported");
    }
    size2.forEach(function(value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError("Invalid size, must contain positive integers (size: " + format3(size2) + ")");
      }
    });
    if (isNumber(array) || isBigNumber(array)) {
      array = [array];
    }
    var _defaultValue = defaultValue !== void 0 ? defaultValue : 0;
    _resize(array, size2, 0, _defaultValue);
    return array;
  }
  function _resize(array, size2, dim, defaultValue) {
    var i3;
    var elem;
    var oldLen = array.length;
    var newLen = size2[dim];
    var minLen = Math.min(oldLen, newLen);
    array.length = newLen;
    if (dim < size2.length - 1) {
      var dimNext = dim + 1;
      for (i3 = 0; i3 < minLen; i3++) {
        elem = array[i3];
        if (!Array.isArray(elem)) {
          elem = [elem];
          array[i3] = elem;
        }
        _resize(elem, size2, dimNext, defaultValue);
      }
      for (i3 = minLen; i3 < newLen; i3++) {
        elem = [];
        array[i3] = elem;
        _resize(elem, size2, dimNext, defaultValue);
      }
    } else {
      for (i3 = 0; i3 < minLen; i3++) {
        while (Array.isArray(array[i3])) {
          array[i3] = array[i3][0];
        }
      }
      for (i3 = minLen; i3 < newLen; i3++) {
        array[i3] = defaultValue;
      }
    }
  }
  function reshape(array, sizes) {
    var flatArray = flatten(array);
    var currentLength = flatArray.length;
    if (!Array.isArray(array) || !Array.isArray(sizes)) {
      throw new TypeError("Array expected");
    }
    if (sizes.length === 0) {
      throw new DimensionError(0, currentLength, "!=");
    }
    sizes = processSizesWildcard(sizes, currentLength);
    var newLength = product(sizes);
    if (currentLength !== newLength) {
      throw new DimensionError(newLength, currentLength, "!=");
    }
    try {
      return _reshape(flatArray, sizes);
    } catch (e3) {
      if (e3 instanceof DimensionError) {
        throw new DimensionError(newLength, currentLength, "!=");
      }
      throw e3;
    }
  }
  function processSizesWildcard(sizes, currentLength) {
    var newLength = product(sizes);
    var processedSizes = sizes.slice();
    var WILDCARD = -1;
    var wildCardIndex = sizes.indexOf(WILDCARD);
    var isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0;
    if (isMoreThanOneWildcard) {
      throw new Error("More than one wildcard in sizes");
    }
    var hasWildcard = wildCardIndex >= 0;
    var canReplaceWildcard = currentLength % newLength === 0;
    if (hasWildcard) {
      if (canReplaceWildcard) {
        processedSizes[wildCardIndex] = -currentLength / newLength;
      } else {
        throw new Error("Could not replace wildcard, since " + currentLength + " is no multiple of " + -newLength);
      }
    }
    return processedSizes;
  }
  function product(array) {
    return array.reduce((prev, curr) => prev * curr, 1);
  }
  function _reshape(array, sizes) {
    var tmpArray = array;
    var tmpArray2;
    for (var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
      var size2 = sizes[sizeIndex];
      tmpArray2 = [];
      var length = tmpArray.length / size2;
      for (var i3 = 0; i3 < length; i3++) {
        tmpArray2.push(tmpArray.slice(i3 * size2, (i3 + 1) * size2));
      }
      tmpArray = tmpArray2;
    }
    return tmpArray;
  }
  function squeeze(array, size2) {
    var s = size2 || arraySize(array);
    while (Array.isArray(array) && array.length === 1) {
      array = array[0];
      s.shift();
    }
    var dims = s.length;
    while (s[dims - 1] === 1) {
      dims--;
    }
    if (dims < s.length) {
      array = _squeeze(array, dims, 0);
      s.length = dims;
    }
    return array;
  }
  function _squeeze(array, dims, dim) {
    var i3, ii;
    if (dim < dims) {
      var next = dim + 1;
      for (i3 = 0, ii = array.length; i3 < ii; i3++) {
        array[i3] = _squeeze(array[i3], dims, next);
      }
    } else {
      while (Array.isArray(array)) {
        array = array[0];
      }
    }
    return array;
  }
  function unsqueeze(array, dims, outer, size2) {
    var s = size2 || arraySize(array);
    if (outer) {
      for (var i3 = 0; i3 < outer; i3++) {
        array = [array];
        s.unshift(1);
      }
    }
    array = _unsqueeze(array, dims, 0);
    while (s.length < dims) {
      s.push(1);
    }
    return array;
  }
  function _unsqueeze(array, dims, dim) {
    var i3, ii;
    if (Array.isArray(array)) {
      var next = dim + 1;
      for (i3 = 0, ii = array.length; i3 < ii; i3++) {
        array[i3] = _unsqueeze(array[i3], dims, next);
      }
    } else {
      for (var d = dim; d < dims; d++) {
        array = [array];
      }
    }
    return array;
  }
  function flatten(array) {
    if (!Array.isArray(array)) {
      return array;
    }
    var flat = [];
    array.forEach(function callback(value) {
      if (Array.isArray(value)) {
        value.forEach(callback);
      } else {
        flat.push(value);
      }
    });
    return flat;
  }
  function map(array, callback) {
    return Array.prototype.map.call(array, callback);
  }
  function forEach(array, callback) {
    Array.prototype.forEach.call(array, callback);
  }
  function filter(array, callback) {
    if (arraySize(array).length !== 1) {
      throw new Error("Only one dimensional matrices supported");
    }
    return Array.prototype.filter.call(array, callback);
  }
  function filterRegExp(array, regexp) {
    if (arraySize(array).length !== 1) {
      throw new Error("Only one dimensional matrices supported");
    }
    return Array.prototype.filter.call(array, (entry) => regexp.test(entry));
  }
  function join(array, separator) {
    return Array.prototype.join.call(array, separator);
  }
  function identify(a) {
    if (!Array.isArray(a)) {
      throw new TypeError("Array input expected");
    }
    if (a.length === 0) {
      return a;
    }
    var b = [];
    var count2 = 0;
    b[0] = {
      value: a[0],
      identifier: 0
    };
    for (var i3 = 1; i3 < a.length; i3++) {
      if (a[i3] === a[i3 - 1]) {
        count2++;
      } else {
        count2 = 0;
      }
      b.push({
        value: a[i3],
        identifier: count2
      });
    }
    return b;
  }
  function generalize(a) {
    if (!Array.isArray(a)) {
      throw new TypeError("Array input expected");
    }
    if (a.length === 0) {
      return a;
    }
    var b = [];
    for (var i3 = 0; i3 < a.length; i3++) {
      b.push(a[i3].value);
    }
    return b;
  }
  function getArrayDataType(array, typeOf3) {
    var type;
    var length = 0;
    for (var i3 = 0; i3 < array.length; i3++) {
      var item = array[i3];
      var _isArray = Array.isArray(item);
      if (i3 === 0 && _isArray) {
        length = item.length;
      }
      if (_isArray && item.length !== length) {
        return void 0;
      }
      var itemType = _isArray ? getArrayDataType(item, typeOf3) : typeOf3(item);
      if (type === void 0) {
        type = itemType;
      } else if (type !== itemType) {
        return "mixed";
      } else {
      }
    }
    return type;
  }
  function concatRecursive(a, b, concatDim, dim) {
    if (dim < concatDim) {
      if (a.length !== b.length) {
        throw new DimensionError(a.length, b.length);
      }
      var c = [];
      for (var i3 = 0; i3 < a.length; i3++) {
        c[i3] = concatRecursive(a[i3], b[i3], concatDim, dim + 1);
      }
      return c;
    } else {
      return a.concat(b);
    }
  }
  function concat() {
    var arrays = Array.prototype.slice.call(arguments, 0, -1);
    var concatDim = Array.prototype.slice.call(arguments, -1);
    if (arrays.length === 1) {
      return arrays[0];
    }
    if (arrays.length > 1) {
      return arrays.slice(1).reduce(function(A2, B2) {
        return concatRecursive(A2, B2, concatDim, 0);
      }, arrays[0]);
    } else {
      throw new Error("Wrong number of arguments in function concat");
    }
  }
  function broadcastSizes() {
    for (var _len = arguments.length, sizes = new Array(_len), _key = 0; _key < _len; _key++) {
      sizes[_key] = arguments[_key];
    }
    var dimensions = sizes.map((s) => s.length);
    var N = Math.max(...dimensions);
    var sizeMax = new Array(N).fill(null);
    for (var i3 = 0; i3 < sizes.length; i3++) {
      var size2 = sizes[i3];
      var dim = dimensions[i3];
      for (var j = 0; j < dim; j++) {
        var n = N - dim + j;
        if (size2[j] > sizeMax[n]) {
          sizeMax[n] = size2[j];
        }
      }
    }
    for (var _i = 0; _i < sizes.length; _i++) {
      checkBroadcastingRules(sizes[_i], sizeMax);
    }
    return sizeMax;
  }
  function checkBroadcastingRules(size2, toSize) {
    var N = toSize.length;
    var dim = size2.length;
    for (var j = 0; j < dim; j++) {
      var n = N - dim + j;
      if (size2[j] < toSize[n] && size2[j] > 1 || size2[j] > toSize[n]) {
        throw new Error("shape missmatch: missmatch is found in arg with shape (".concat(size2, ") not possible to broadcast dimension ").concat(dim, " with size ").concat(size2[j], " to size ").concat(toSize[n]));
      }
    }
  }
  function broadcastTo(array, toSize) {
    var Asize = arraySize(array);
    if (deepStrictEqual(Asize, toSize)) {
      return array;
    }
    checkBroadcastingRules(Asize, toSize);
    var broadcastedSize = broadcastSizes(Asize, toSize);
    var N = broadcastedSize.length;
    var paddedSize = [...Array(N - Asize.length).fill(1), ...Asize];
    var A2 = clone2(array);
    if (Asize.length < N) {
      A2 = reshape(A2, paddedSize);
      Asize = arraySize(A2);
    }
    for (var dim = 0; dim < N; dim++) {
      if (Asize[dim] < broadcastedSize[dim]) {
        A2 = stretch(A2, broadcastedSize[dim], dim);
        Asize = arraySize(A2);
      }
    }
    return A2;
  }
  function stretch(arrayToStretch, sizeToStretch, dimToStretch) {
    return concat(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch);
  }
  function clone2(array) {
    return _extends([], array);
  }

  // node_modules/mathjs/lib/esm/utils/factory.js
  function factory(name310, dependencies310, create, meta) {
    function assertAndCreate(scope) {
      var deps = pickShallow(scope, dependencies310.map(stripOptionalNotation));
      assertDependencies(name310, dependencies310, scope);
      return create(deps);
    }
    assertAndCreate.isFactory = true;
    assertAndCreate.fn = name310;
    assertAndCreate.dependencies = dependencies310.slice().sort();
    if (meta) {
      assertAndCreate.meta = meta;
    }
    return assertAndCreate;
  }
  function assertDependencies(name310, dependencies310, scope) {
    var allDefined = dependencies310.filter((dependency) => !isOptionalDependency(dependency)).every((dependency) => scope[dependency] !== void 0);
    if (!allDefined) {
      var missingDependencies = dependencies310.filter((dependency) => scope[dependency] === void 0);
      throw new Error('Cannot create function "'.concat(name310, '", ') + "some dependencies are missing: ".concat(missingDependencies.map((d) => '"'.concat(d, '"')).join(", "), "."));
    }
  }
  function isOptionalDependency(dependency) {
    return dependency && dependency[0] === "?";
  }
  function stripOptionalNotation(dependency) {
    return dependency && dependency[0] === "?" ? dependency.slice(1) : dependency;
  }

  // node_modules/mathjs/lib/esm/utils/customs.js
  function getSafeProperty(object, prop) {
    if (isPlainObject(object) && isSafeProperty(object, prop)) {
      return object[prop];
    }
    if (typeof object[prop] === "function" && isSafeMethod(object, prop)) {
      throw new Error('Cannot access method "' + prop + '" as a property');
    }
    throw new Error('No access to property "' + prop + '"');
  }
  function setSafeProperty(object, prop, value) {
    if (isPlainObject(object) && isSafeProperty(object, prop)) {
      object[prop] = value;
      return value;
    }
    throw new Error('No access to property "' + prop + '"');
  }
  function hasSafeProperty(object, prop) {
    return prop in object;
  }
  function isSafeProperty(object, prop) {
    if (!object || typeof object !== "object") {
      return false;
    }
    if (hasOwnProperty(safeNativeProperties, prop)) {
      return true;
    }
    if (prop in Object.prototype) {
      return false;
    }
    if (prop in Function.prototype) {
      return false;
    }
    return true;
  }
  function getSafeMethod(object, method) {
    if (!isSafeMethod(object, method)) {
      throw new Error('No access to method "' + method + '"');
    }
    return object[method];
  }
  function isSafeMethod(object, method) {
    if (object === null || object === void 0 || typeof object[method] !== "function") {
      return false;
    }
    if (hasOwnProperty(object, method) && Object.getPrototypeOf && method in Object.getPrototypeOf(object)) {
      return false;
    }
    if (hasOwnProperty(safeNativeMethods, method)) {
      return true;
    }
    if (method in Object.prototype) {
      return false;
    }
    if (method in Function.prototype) {
      return false;
    }
    return true;
  }
  function isPlainObject(object) {
    return typeof object === "object" && object && object.constructor === Object;
  }
  var safeNativeProperties = {
    length: true,
    name: true
  };
  var safeNativeMethods = {
    toString: true,
    valueOf: true,
    toLocaleString: true
  };

  // node_modules/mathjs/lib/esm/utils/map.js
  var ObjectWrappingMap = class {
    constructor(object) {
      this.wrappedObject = object;
    }
    keys() {
      return Object.keys(this.wrappedObject);
    }
    get(key) {
      return getSafeProperty(this.wrappedObject, key);
    }
    set(key, value) {
      setSafeProperty(this.wrappedObject, key, value);
      return this;
    }
    has(key) {
      return hasSafeProperty(this.wrappedObject, key);
    }
  };
  function createEmptyMap() {
    return /* @__PURE__ */ new Map();
  }
  function createMap(mapOrObject) {
    if (!mapOrObject) {
      return createEmptyMap();
    }
    if (isMap(mapOrObject)) {
      return mapOrObject;
    }
    if (isObject(mapOrObject)) {
      return new ObjectWrappingMap(mapOrObject);
    }
    throw new Error("createMap can create maps from objects or Maps");
  }
  function toObject(map3) {
    if (map3 instanceof ObjectWrappingMap) {
      return map3.wrappedObject;
    }
    var object = {};
    for (var key of map3.keys()) {
      var value = map3.get(key);
      setSafeProperty(object, key, value);
    }
    return object;
  }
  function isMap(object) {
    if (!object) {
      return false;
    }
    return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === "function" && typeof object.get === "function" && typeof object.keys === "function" && typeof object.has === "function";
  }
  function assign(map3) {
    for (var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objects[_key - 1] = arguments[_key];
    }
    for (var args of objects) {
      if (!args) {
        continue;
      }
      if (isMap(args)) {
        for (var key of args.keys()) {
          map3.set(key, args.get(key));
        }
      } else if (isObject(args)) {
        for (var _key2 of Object.keys(args)) {
          map3.set(_key2, args[_key2]);
        }
      }
    }
    return map3;
  }

  // node_modules/mathjs/lib/esm/core/function/typed.js
  var _createTyped2 = function _createTyped() {
    _createTyped2 = import_typed_function.default.create;
    return import_typed_function.default;
  };
  var dependencies = ["?BigNumber", "?Complex", "?DenseMatrix", "?Fraction"];
  var createTyped = /* @__PURE__ */ factory("typed", dependencies, function createTyped2(_ref) {
    var {
      BigNumber: BigNumber2,
      Complex: Complex3,
      DenseMatrix: DenseMatrix2,
      Fraction: Fraction3
    } = _ref;
    var typed3 = _createTyped2();
    typed3.clear();
    typed3.addTypes([
      {
        name: "number",
        test: isNumber
      },
      {
        name: "Complex",
        test: isComplex
      },
      {
        name: "BigNumber",
        test: isBigNumber
      },
      {
        name: "Fraction",
        test: isFraction
      },
      {
        name: "Unit",
        test: isUnit
      },
      // The following type matches a valid variable name, i.e., an alphanumeric
      // string starting with an alphabetic character. It is used (at least)
      // in the definition of the derivative() function, as the argument telling
      // what to differentiate over must (currently) be a variable.
      {
        name: "identifier",
        test: (s) => isString && /^(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])*$/.test(s)
      },
      {
        name: "string",
        test: isString
      },
      {
        name: "Chain",
        test: isChain
      },
      {
        name: "Array",
        test: isArray
      },
      {
        name: "Matrix",
        test: isMatrix
      },
      {
        name: "DenseMatrix",
        test: isDenseMatrix
      },
      {
        name: "SparseMatrix",
        test: isSparseMatrix
      },
      {
        name: "Range",
        test: isRange
      },
      {
        name: "Index",
        test: isIndex
      },
      {
        name: "boolean",
        test: isBoolean
      },
      {
        name: "ResultSet",
        test: isResultSet
      },
      {
        name: "Help",
        test: isHelp
      },
      {
        name: "function",
        test: isFunction
      },
      {
        name: "Date",
        test: isDate
      },
      {
        name: "RegExp",
        test: isRegExp
      },
      {
        name: "null",
        test: isNull
      },
      {
        name: "undefined",
        test: isUndefined
      },
      {
        name: "AccessorNode",
        test: isAccessorNode
      },
      {
        name: "ArrayNode",
        test: isArrayNode
      },
      {
        name: "AssignmentNode",
        test: isAssignmentNode
      },
      {
        name: "BlockNode",
        test: isBlockNode
      },
      {
        name: "ConditionalNode",
        test: isConditionalNode
      },
      {
        name: "ConstantNode",
        test: isConstantNode
      },
      {
        name: "FunctionNode",
        test: isFunctionNode
      },
      {
        name: "FunctionAssignmentNode",
        test: isFunctionAssignmentNode
      },
      {
        name: "IndexNode",
        test: isIndexNode
      },
      {
        name: "Node",
        test: isNode
      },
      {
        name: "ObjectNode",
        test: isObjectNode
      },
      {
        name: "OperatorNode",
        test: isOperatorNode
      },
      {
        name: "ParenthesisNode",
        test: isParenthesisNode
      },
      {
        name: "RangeNode",
        test: isRangeNode
      },
      {
        name: "RelationalNode",
        test: isRelationalNode
      },
      {
        name: "SymbolNode",
        test: isSymbolNode
      },
      {
        name: "Map",
        test: isMap
      },
      {
        name: "Object",
        test: isObject
      }
      // order 'Object' last, it matches on other classes too
    ]);
    typed3.addConversions([{
      from: "number",
      to: "BigNumber",
      convert: function convert(x) {
        if (!BigNumber2) {
          throwNoBignumber(x);
        }
        if (digits(x) > 15) {
          throw new TypeError("Cannot implicitly convert a number with >15 significant digits to BigNumber (value: " + x + "). Use function bignumber(x) to convert to BigNumber.");
        }
        return new BigNumber2(x);
      }
    }, {
      from: "number",
      to: "Complex",
      convert: function convert(x) {
        if (!Complex3) {
          throwNoComplex(x);
        }
        return new Complex3(x, 0);
      }
    }, {
      from: "BigNumber",
      to: "Complex",
      convert: function convert(x) {
        if (!Complex3) {
          throwNoComplex(x);
        }
        return new Complex3(x.toNumber(), 0);
      }
    }, {
      from: "Fraction",
      to: "BigNumber",
      convert: function convert(x) {
        throw new TypeError("Cannot implicitly convert a Fraction to BigNumber or vice versa. Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.");
      }
    }, {
      from: "Fraction",
      to: "Complex",
      convert: function convert(x) {
        if (!Complex3) {
          throwNoComplex(x);
        }
        return new Complex3(x.valueOf(), 0);
      }
    }, {
      from: "number",
      to: "Fraction",
      convert: function convert(x) {
        if (!Fraction3) {
          throwNoFraction(x);
        }
        var f = new Fraction3(x);
        if (f.valueOf() !== x) {
          throw new TypeError("Cannot implicitly convert a number to a Fraction when there will be a loss of precision (value: " + x + "). Use function fraction(x) to convert to Fraction.");
        }
        return f;
      }
    }, {
      // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
      //  from: 'Fraction',
      //  to: 'number',
      //  convert: function (x) {
      //    return x.valueOf()
      //  }
      // }, {
      from: "string",
      to: "number",
      convert: function convert(x) {
        var n = Number(x);
        if (isNaN(n)) {
          throw new Error('Cannot convert "' + x + '" to a number');
        }
        return n;
      }
    }, {
      from: "string",
      to: "BigNumber",
      convert: function convert(x) {
        if (!BigNumber2) {
          throwNoBignumber(x);
        }
        try {
          return new BigNumber2(x);
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to BigNumber');
        }
      }
    }, {
      from: "string",
      to: "Fraction",
      convert: function convert(x) {
        if (!Fraction3) {
          throwNoFraction(x);
        }
        try {
          return new Fraction3(x);
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to Fraction');
        }
      }
    }, {
      from: "string",
      to: "Complex",
      convert: function convert(x) {
        if (!Complex3) {
          throwNoComplex(x);
        }
        try {
          return new Complex3(x);
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to Complex');
        }
      }
    }, {
      from: "boolean",
      to: "number",
      convert: function convert(x) {
        return +x;
      }
    }, {
      from: "boolean",
      to: "BigNumber",
      convert: function convert(x) {
        if (!BigNumber2) {
          throwNoBignumber(x);
        }
        return new BigNumber2(+x);
      }
    }, {
      from: "boolean",
      to: "Fraction",
      convert: function convert(x) {
        if (!Fraction3) {
          throwNoFraction(x);
        }
        return new Fraction3(+x);
      }
    }, {
      from: "boolean",
      to: "string",
      convert: function convert(x) {
        return String(x);
      }
    }, {
      from: "Array",
      to: "Matrix",
      convert: function convert(array) {
        if (!DenseMatrix2) {
          throwNoMatrix();
        }
        return new DenseMatrix2(array);
      }
    }, {
      from: "Matrix",
      to: "Array",
      convert: function convert(matrix2) {
        return matrix2.valueOf();
      }
    }]);
    typed3.onMismatch = (name310, args, signatures) => {
      var usualError = typed3.createError(name310, args, signatures);
      if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
      signatures.some((sig) => !sig.params.includes(","))) {
        var err = new TypeError("Function '".concat(name310, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name310, ")'."));
        err.data = usualError.data;
        throw err;
      }
      throw usualError;
    };
    typed3.onMismatch = (name310, args, signatures) => {
      var usualError = typed3.createError(name310, args, signatures);
      if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
      signatures.some((sig) => !sig.params.includes(","))) {
        var err = new TypeError("Function '".concat(name310, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name310, ")'."));
        err.data = usualError.data;
        throw err;
      }
      throw usualError;
    };
    return typed3;
  });
  function throwNoBignumber(x) {
    throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
  }
  function throwNoComplex(x) {
    throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
  }
  function throwNoMatrix() {
    throw new Error("Cannot convert array into a Matrix: no class 'DenseMatrix' provided");
  }
  function throwNoFraction(x) {
    throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
  }

  // node_modules/mathjs/lib/esm/type/resultset/ResultSet.js
  var name = "ResultSet";
  var dependencies2 = [];
  var createResultSet = /* @__PURE__ */ factory(name, dependencies2, () => {
    function ResultSet2(entries) {
      if (!(this instanceof ResultSet2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      this.entries = entries || [];
    }
    ResultSet2.prototype.type = "ResultSet";
    ResultSet2.prototype.isResultSet = true;
    ResultSet2.prototype.valueOf = function() {
      return this.entries;
    };
    ResultSet2.prototype.toString = function() {
      return "[" + this.entries.join(", ") + "]";
    };
    ResultSet2.prototype.toJSON = function() {
      return {
        mathjs: "ResultSet",
        entries: this.entries
      };
    };
    ResultSet2.fromJSON = function(json) {
      return new ResultSet2(json.entries);
    };
    return ResultSet2;
  }, {
    isClass: true
  });

  // node_modules/decimal.js/decimal.mjs
  var EXP_LIMIT = 9e15;
  var MAX_DIGITS = 1e9;
  var NUMERALS = "0123456789abcdef";
  var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
  var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
  var DEFAULTS = {
    // These values must be integers within the stated ranges (inclusive).
    // Most of these values can be changed at run-time using the `Decimal.config` method.
    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    precision: 20,
    // 1 to MAX_DIGITS
    // The rounding mode used when rounding to `precision`.
    //
    // ROUND_UP         0 Away from zero.
    // ROUND_DOWN       1 Towards zero.
    // ROUND_CEIL       2 Towards +Infinity.
    // ROUND_FLOOR      3 Towards -Infinity.
    // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    rounding: 4,
    // 0 to 8
    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP         0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
    // FLOOR      3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN  6 The IEEE 754 remainder function.
    // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
    //
    // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
    // division (9) are commonly used for the modulus operation. The other rounding modes can also
    // be used, but they may not give useful results.
    modulo: 1,
    // 0 to 9
    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    toExpNeg: -7,
    // 0 to -EXP_LIMIT
    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    toExpPos: 21,
    // 0 to EXP_LIMIT
    // The minimum exponent value, beneath which underflow to zero occurs.
    // JavaScript numbers: -324  (5e-324)
    minE: -EXP_LIMIT,
    // -1 to -EXP_LIMIT
    // The maximum exponent value, above which overflow to Infinity occurs.
    // JavaScript numbers: 308  (1.7976931348623157e+308)
    maxE: EXP_LIMIT,
    // 1 to EXP_LIMIT
    // Whether to use cryptographically-secure random number generation, if available.
    crypto: false
    // true/false
  };
  var inexact;
  var quadrant;
  var external = true;
  var decimalError = "[DecimalError] ";
  var invalidArgument = decimalError + "Invalid argument: ";
  var precisionLimitExceeded = decimalError + "Precision limit exceeded";
  var cryptoUnavailable = decimalError + "crypto unavailable";
  var tag = "[object Decimal]";
  var mathfloor = Math.floor;
  var mathpow = Math.pow;
  var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
  var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
  var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
  var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  var BASE = 1e7;
  var LOG_BASE = 7;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var LN10_PRECISION = LN10.length - 1;
  var PI_PRECISION = PI.length - 1;
  var P = { toStringTag: tag };
  P.absoluteValue = P.abs = function() {
    var x = new this.constructor(this);
    if (x.s < 0)
      x.s = 1;
    return finalise(x);
  };
  P.ceil = function() {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };
  P.clampedTo = P.clamp = function(min3, max3) {
    var k, x = this, Ctor = x.constructor;
    min3 = new Ctor(min3);
    max3 = new Ctor(max3);
    if (!min3.s || !max3.s)
      return new Ctor(NaN);
    if (min3.gt(max3))
      throw Error(invalidArgument + max3);
    k = x.cmp(min3);
    return k < 0 ? min3 : x.cmp(max3) > 0 ? max3 : new Ctor(x);
  };
  P.comparedTo = P.cmp = function(y2) {
    var i3, j, xdL, ydL, x = this, xd = x.d, yd = (y2 = new x.constructor(y2)).d, xs = x.s, ys = y2.s;
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }
    if (!xd[0] || !yd[0])
      return xd[0] ? xs : yd[0] ? -ys : 0;
    if (xs !== ys)
      return xs;
    if (x.e !== y2.e)
      return x.e > y2.e ^ xs < 0 ? 1 : -1;
    xdL = xd.length;
    ydL = yd.length;
    for (i3 = 0, j = xdL < ydL ? xdL : ydL; i3 < j; ++i3) {
      if (xd[i3] !== yd[i3])
        return xd[i3] > yd[i3] ^ xs < 0 ? 1 : -1;
    }
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };
  P.cosine = P.cos = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.d)
      return new Ctor(NaN);
    if (!x.d[0])
      return new Ctor(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
  };
  P.cubeRoot = P.cbrt = function() {
    var e3, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    external = false;
    s = x.s * mathpow(x.s * x, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
      n = digitsToString(x.d);
      e3 = x.e;
      if (s = (e3 - n.length + 1) % 3)
        n += s == 1 || s == -2 ? "0" : "00";
      s = mathpow(n, 1 / 3);
      e3 = mathfloor((e3 + 1) / 3) - (e3 % 3 == (e3 < 0 ? -1 : 2));
      if (s == 1 / 0) {
        n = "5e" + e3;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e3;
      }
      r = new Ctor(n);
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e3 = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);
        if (n == "9999" || !rep && n == "4999") {
          if (!rep) {
            finalise(t, e3 + 1, 0);
            if (t.times(t).times(t).eq(x)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
            finalise(r, e3 + 1, 1);
            m = !r.times(r).times(r).eq(x);
          }
          break;
        }
      }
    }
    external = true;
    return finalise(r, e3, Ctor.rounding, m);
  };
  P.decimalPlaces = P.dp = function() {
    var w2, d = this.d, n = NaN;
    if (d) {
      w2 = d.length - 1;
      n = (w2 - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
      w2 = d[w2];
      if (w2)
        for (; w2 % 10 == 0; w2 /= 10)
          n--;
      if (n < 0)
        n = 0;
    }
    return n;
  };
  P.dividedBy = P.div = function(y2) {
    return divide(this, new this.constructor(y2));
  };
  P.dividedToIntegerBy = P.divToInt = function(y2) {
    var x = this, Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y2), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };
  P.equals = P.eq = function(y2) {
    return this.cmp(y2) === 0;
  };
  P.floor = function() {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };
  P.greaterThan = P.gt = function(y2) {
    return this.cmp(y2) > 0;
  };
  P.greaterThanOrEqualTo = P.gte = function(y2) {
    var k = this.cmp(y2);
    return k == 1 || k === 0;
  };
  P.hyperbolicCosine = P.cosh = function() {
    var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
    if (!x.isFinite())
      return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero())
      return one;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      n = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n = "2.3283064365386962890625e-10";
    }
    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
    var cosh2_x, i3 = k, d8 = new Ctor(8);
    for (; i3--; ) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }
    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.hyperbolicSine = P.sinh = function() {
    var k, pr, rm, len, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;
      x = x.times(1 / tinyPow(5, k));
      x = taylorSeries(Ctor, 2, x, x, true);
      var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
      for (; k--; ) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(x, pr, rm, true);
  };
  P.hyperbolicTangent = P.tanh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(x.s);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;
    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };
  P.inverseCosine = P.acos = function() {
    var halfPi, x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
    if (k !== -1) {
      return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
    }
    if (x.isZero())
      return getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return halfPi.minus(x);
  };
  P.inverseHyperbolicCosine = P.acosh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (x.lte(1))
      return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).minus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
  };
  P.inverseHyperbolicSine = P.asinh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).plus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
  };
  P.inverseHyperbolicTangent = P.atanh = function() {
    var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.e >= 0)
      return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();
    if (Math.max(xsd, pr) < 2 * -x.e - 1)
      return finalise(new Ctor(x), pr, rm, true);
    Ctor.precision = wpr = xsd - x.e;
    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
    Ctor.precision = pr + 4;
    Ctor.rounding = 1;
    x = x.ln();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(0.5);
  };
  P.inverseSine = P.asin = function() {
    var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
    if (x.isZero())
      return new Ctor(x);
    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (k !== -1) {
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x.s;
        return halfPi;
      }
      return new Ctor(NaN);
    }
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(2);
  };
  P.inverseTangent = P.atan = function() {
    var i3, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
    if (!x.isFinite()) {
      if (!x.s)
        return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x.s;
      return r;
    }
    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;
    k = Math.min(28, wpr / LOG_BASE + 2 | 0);
    for (i3 = k; i3; --i3)
      x = x.div(x.times(x).plus(1).sqrt().plus(1));
    external = false;
    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;
    for (; i3 !== -1; ) {
      px = px.times(x2);
      t = r.minus(px.div(n += 2));
      px = px.times(x2);
      r = t.plus(px.div(n += 2));
      if (r.d[j] !== void 0)
        for (i3 = j; r.d[i3] === t.d[i3] && i3--; )
          ;
    }
    if (k)
      r = r.times(2 << k - 1);
    external = true;
    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.isFinite = function() {
    return !!this.d;
  };
  P.isInteger = P.isInt = function() {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = P.isNeg = function() {
    return this.s < 0;
  };
  P.isPositive = P.isPos = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.d && this.d[0] === 0;
  };
  P.lessThan = P.lt = function(y2) {
    return this.cmp(y2) < 0;
  };
  P.lessThanOrEqualTo = P.lte = function(y2) {
    return this.cmp(y2) < 1;
  };
  P.logarithm = P.log = function(base) {
    var isBase10, d, denominator, k, inf, num, sd, r, arg2 = this, Ctor = arg2.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
    if (base == null) {
      base = new Ctor(10);
      isBase10 = true;
    } else {
      base = new Ctor(base);
      d = base.d;
      if (base.s < 0 || !d || !d[0] || base.eq(1))
        return new Ctor(NaN);
      isBase10 = base.eq(10);
    }
    d = arg2.d;
    if (arg2.s < 0 || !d || !d[0] || arg2.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg2.s != 1 ? NaN : d ? 0 : 1 / 0);
    }
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0; )
          k /= 10;
        inf = k !== 1;
      }
    }
    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg2, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
    r = divide(num, denominator, sd, 1);
    if (checkRoundingDigits(r.d, k = pr, rm)) {
      do {
        sd += 10;
        num = naturalLogarithm(arg2, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
        r = divide(num, denominator, sd, 1);
        if (!inf) {
          if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
            r = finalise(r, pr + 1, 0);
          }
          break;
        }
      } while (checkRoundingDigits(r.d, k += 10, rm));
    }
    external = true;
    return finalise(r, pr, rm);
  };
  P.minus = P.sub = function(y2) {
    var d, e3, i3, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
    y2 = new Ctor(y2);
    if (!x.d || !y2.d) {
      if (!x.s || !y2.s)
        y2 = new Ctor(NaN);
      else if (x.d)
        y2.s = -y2.s;
      else
        y2 = new Ctor(y2.d || x.s !== y2.s ? x : NaN);
      return y2;
    }
    if (x.s != y2.s) {
      y2.s = -y2.s;
      return x.plus(y2);
    }
    xd = x.d;
    yd = y2.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (yd[0])
        y2.s = -y2.s;
      else if (xd[0])
        y2 = new Ctor(x);
      else
        return new Ctor(rm === 3 ? -0 : 0);
      return external ? finalise(y2, pr, rm) : y2;
    }
    e3 = mathfloor(y2.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);
    xd = xd.slice();
    k = xe - e3;
    if (k) {
      xLTy = k < 0;
      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e3 = xe;
        len = xd.length;
      }
      i3 = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
      if (k > i3) {
        k = i3;
        d.length = 1;
      }
      d.reverse();
      for (i3 = k; i3--; )
        d.push(0);
      d.reverse();
    } else {
      i3 = xd.length;
      len = yd.length;
      xLTy = i3 < len;
      if (xLTy)
        len = i3;
      for (i3 = 0; i3 < len; i3++) {
        if (xd[i3] != yd[i3]) {
          xLTy = xd[i3] < yd[i3];
          break;
        }
      }
      k = 0;
    }
    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y2.s = -y2.s;
    }
    len = xd.length;
    for (i3 = yd.length - len; i3 > 0; --i3)
      xd[len++] = 0;
    for (i3 = yd.length; i3 > k; ) {
      if (xd[--i3] < yd[i3]) {
        for (j = i3; j && xd[--j] === 0; )
          xd[j] = BASE - 1;
        --xd[j];
        xd[i3] += BASE;
      }
      xd[i3] -= yd[i3];
    }
    for (; xd[--len] === 0; )
      xd.pop();
    for (; xd[0] === 0; xd.shift())
      --e3;
    if (!xd[0])
      return new Ctor(rm === 3 ? -0 : 0);
    y2.d = xd;
    y2.e = getBase10Exponent(xd, e3);
    return external ? finalise(y2, pr, rm) : y2;
  };
  P.modulo = P.mod = function(y2) {
    var q, x = this, Ctor = x.constructor;
    y2 = new Ctor(y2);
    if (!x.d || !y2.s || y2.d && !y2.d[0])
      return new Ctor(NaN);
    if (!y2.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }
    external = false;
    if (Ctor.modulo == 9) {
      q = divide(x, y2.abs(), 0, 3, 1);
      q.s *= y2.s;
    } else {
      q = divide(x, y2, 0, Ctor.modulo, 1);
    }
    q = q.times(y2);
    external = true;
    return x.minus(q);
  };
  P.naturalExponential = P.exp = function() {
    return naturalExponential(this);
  };
  P.naturalLogarithm = P.ln = function() {
    return naturalLogarithm(this);
  };
  P.negated = P.neg = function() {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };
  P.plus = P.add = function(y2) {
    var carry, d, e3, i3, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
    y2 = new Ctor(y2);
    if (!x.d || !y2.d) {
      if (!x.s || !y2.s)
        y2 = new Ctor(NaN);
      else if (!x.d)
        y2 = new Ctor(y2.d || x.s === y2.s ? x : NaN);
      return y2;
    }
    if (x.s != y2.s) {
      y2.s = -y2.s;
      return x.minus(y2);
    }
    xd = x.d;
    yd = y2.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (!yd[0])
        y2 = new Ctor(x);
      return external ? finalise(y2, pr, rm) : y2;
    }
    k = mathfloor(x.e / LOG_BASE);
    e3 = mathfloor(y2.e / LOG_BASE);
    xd = xd.slice();
    i3 = k - e3;
    if (i3) {
      if (i3 < 0) {
        d = xd;
        i3 = -i3;
        len = yd.length;
      } else {
        d = yd;
        e3 = k;
        len = xd.length;
      }
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;
      if (i3 > len) {
        i3 = len;
        d.length = 1;
      }
      d.reverse();
      for (; i3--; )
        d.push(0);
      d.reverse();
    }
    len = xd.length;
    i3 = yd.length;
    if (len - i3 < 0) {
      i3 = len;
      d = yd;
      yd = xd;
      xd = d;
    }
    for (carry = 0; i3; ) {
      carry = (xd[--i3] = xd[i3] + yd[i3] + carry) / BASE | 0;
      xd[i3] %= BASE;
    }
    if (carry) {
      xd.unshift(carry);
      ++e3;
    }
    for (len = xd.length; xd[--len] == 0; )
      xd.pop();
    y2.d = xd;
    y2.e = getBase10Exponent(xd, e3);
    return external ? finalise(y2, pr, rm) : y2;
  };
  P.precision = P.sd = function(z) {
    var k, x = this;
    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0)
      throw Error(invalidArgument + z);
    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k)
        k = x.e + 1;
    } else {
      k = NaN;
    }
    return k;
  };
  P.round = function() {
    var x = this, Ctor = x.constructor;
    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };
  P.sine = P.sin = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = sine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n, sd, r, rep, t, x = this, d = x.d, e3 = x.e, s = x.s, Ctor = x.constructor;
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x);
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(d);
      if ((n.length + e3) % 2 == 0)
        n += "0";
      s = Math.sqrt(n);
      e3 = mathfloor((e3 + 1) / 2) - (e3 < 0 || e3 % 2);
      if (s == 1 / 0) {
        n = "5e" + e3;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e3;
      }
      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e3 = Ctor.precision) + 3;
    for (; ; ) {
      t = r;
      r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);
        if (n == "9999" || !rep && n == "4999") {
          if (!rep) {
            finalise(t, e3 + 1, 0);
            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          }
          sd += 4;
          rep = 1;
        } else {
          if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
            finalise(r, e3 + 1, 1);
            m = !r.times(r).eq(x);
          }
          break;
        }
      }
    }
    external = true;
    return finalise(r, e3, Ctor.rounding, m);
  };
  P.tangent = P.tan = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite())
      return new Ctor(NaN);
    if (x.isZero())
      return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;
    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
  };
  P.times = P.mul = function(y2) {
    var carry, e3, i3, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y2 = new Ctor(y2)).d;
    y2.s *= x.s;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(!y2.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y2.s / 0 : y2.s * 0);
    }
    e3 = mathfloor(x.e / LOG_BASE) + mathfloor(y2.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }
    r = [];
    rL = xdL + ydL;
    for (i3 = rL; i3--; )
      r.push(0);
    for (i3 = ydL; --i3 >= 0; ) {
      carry = 0;
      for (k = xdL + i3; k > i3; ) {
        t = r[k] + yd[i3] * xd[k - i3 - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }
      r[k] = (r[k] + carry) % BASE | 0;
    }
    for (; !r[--rL]; )
      r.pop();
    if (carry)
      ++e3;
    else
      r.shift();
    y2.d = r;
    y2.e = getBase10Exponent(r, e3);
    return external ? finalise(y2, Ctor.precision, Ctor.rounding) : y2;
  };
  P.toBinary = function(sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };
  P.toDecimalPlaces = P.toDP = function(dp, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (dp === void 0)
      return x;
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    return finalise(x, dp + x.e + 1, rm);
  };
  P.toExponential = function(dp, rm) {
    var str, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFixed = function(dp, rm) {
    var str, y2, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      y2 = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y2, false, dp + y2.e + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFraction = function(maxD) {
    var d, d0, d1, d2, e3, k, n, n0, n16, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
    if (!xd)
      return new Ctor(x);
    n16 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);
    d = new Ctor(d1);
    e3 = d.e = getPrecision(xd) - x.e - 1;
    k = e3 % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
    if (maxD == null) {
      maxD = e3 > 0 ? d : n16;
    } else {
      n = new Ctor(maxD);
      if (!n.isInt() || n.lt(n16))
        throw Error(invalidArgument + n);
      maxD = n.gt(d) ? e3 > 0 ? d : n16 : n;
    }
    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e3 = xd.length * LOG_BASE * 2;
    for (; ; ) {
      q = divide(n, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1)
        break;
      d0 = d1;
      d1 = d2;
      d2 = n16;
      n16 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n.minus(q.times(d2));
      n = d2;
    }
    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n16));
    d0 = d0.plus(d2.times(d1));
    n0.s = n16.s = x.s;
    r = divide(n16, d1, e3, 1).minus(x).abs().cmp(divide(n0, d0, e3, 1).minus(x).abs()) < 1 ? [n16, d1] : [n0, d0];
    Ctor.precision = pr;
    external = true;
    return r;
  };
  P.toHexadecimal = P.toHex = function(sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };
  P.toNearest = function(y2, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (y2 == null) {
      if (!x.d)
        return x;
      y2 = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y2 = new Ctor(y2);
      if (rm === void 0) {
        rm = Ctor.rounding;
      } else {
        checkInt32(rm, 0, 8);
      }
      if (!x.d)
        return y2.s ? x : y2;
      if (!y2.d) {
        if (y2.s)
          y2.s = x.s;
        return y2;
      }
    }
    if (y2.d[0]) {
      external = false;
      x = divide(x, y2, 0, rm, 1).times(y2);
      external = true;
      finalise(x);
    } else {
      y2.s = x.s;
      x = y2;
    }
    return x;
  };
  P.toNumber = function() {
    return +this;
  };
  P.toOctal = function(sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };
  P.toPower = P.pow = function(y2) {
    var e3, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y2 = new Ctor(y2));
    if (!x.d || !y2.d || !x.d[0] || !y2.d[0])
      return new Ctor(mathpow(+x, yn));
    x = new Ctor(x);
    if (x.eq(1))
      return x;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (y2.eq(1))
      return finalise(x, pr, rm);
    e3 = mathfloor(y2.e / LOG_BASE);
    if (e3 >= y2.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y2.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }
    s = x.s;
    if (s < 0) {
      if (e3 < y2.d.length - 1)
        return new Ctor(NaN);
      if ((y2.d[e3] & 1) == 0)
        s = 1;
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }
    k = mathpow(+x, yn);
    e3 = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
    if (e3 > Ctor.maxE + 1 || e3 < Ctor.minE - 1)
      return new Ctor(e3 > 0 ? s / 0 : 0);
    external = false;
    Ctor.rounding = x.s = 1;
    k = Math.min(12, (e3 + "").length);
    r = naturalExponential(y2.times(naturalLogarithm(x, pr + k)), pr);
    if (r.d) {
      r = finalise(r, pr + 5, 1);
      if (checkRoundingDigits(r.d, pr, rm)) {
        e3 = pr + 10;
        r = finalise(naturalExponential(y2.times(naturalLogarithm(x, e3 + k)), e3), e3 + 5, 1);
        if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
      }
    }
    r.s = s;
    external = true;
    Ctor.rounding = rm;
    return finalise(r, pr, rm);
  };
  P.toPrecision = function(sd, rm) {
    var str, x = this, Ctor = x.constructor;
    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toSignificantDigits = P.toSD = function(sd, rm) {
    var x = this, Ctor = x.constructor;
    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
    }
    return finalise(new Ctor(x), sd, rm);
  };
  P.toString = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.truncated = P.trunc = function() {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };
  P.valueOf = P.toJSON = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() ? "-" + str : str;
  };
  function digitsToString(d) {
    var i3, k, ws, indexOfLastWord = d.length - 1, str = "", w2 = d[0];
    if (indexOfLastWord > 0) {
      str += w2;
      for (i3 = 1; i3 < indexOfLastWord; i3++) {
        ws = d[i3] + "";
        k = LOG_BASE - ws.length;
        if (k)
          str += getZeroString(k);
        str += ws;
      }
      w2 = d[i3];
      ws = w2 + "";
      k = LOG_BASE - ws.length;
      if (k)
        str += getZeroString(k);
    } else if (w2 === 0) {
      return "0";
    }
    for (; w2 % 10 === 0; )
      w2 /= 10;
    return str + w2;
  }
  function checkInt32(i3, min3, max3) {
    if (i3 !== ~~i3 || i3 < min3 || i3 > max3) {
      throw Error(invalidArgument + i3);
    }
  }
  function checkRoundingDigits(d, i3, rm, repeating) {
    var di, k, r, rd;
    for (k = d[0]; k >= 10; k /= 10)
      --i3;
    if (--i3 < 0) {
      i3 += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i3 + 1) / LOG_BASE);
      i3 %= LOG_BASE;
    }
    k = mathpow(10, LOG_BASE - i3);
    rd = d[di] % k | 0;
    if (repeating == null) {
      if (i3 < 3) {
        if (i3 == 0)
          rd = rd / 100 | 0;
        else if (i3 == 1)
          rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i3 - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i3 < 4) {
        if (i3 == 0)
          rd = rd / 1e3 | 0;
        else if (i3 == 1)
          rd = rd / 100 | 0;
        else if (i3 == 2)
          rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i3 - 3) - 1;
      }
    }
    return r;
  }
  function convertBase(str, baseIn, baseOut) {
    var j, arr = [0], arrL, i3 = 0, strL = str.length;
    for (; i3 < strL; ) {
      for (arrL = arr.length; arrL--; )
        arr[arrL] *= baseIn;
      arr[0] += NUMERALS.indexOf(str.charAt(i3++));
      for (j = 0; j < arr.length; j++) {
        if (arr[j] > baseOut - 1) {
          if (arr[j + 1] === void 0)
            arr[j + 1] = 0;
          arr[j + 1] += arr[j] / baseOut | 0;
          arr[j] %= baseOut;
        }
      }
    }
    return arr.reverse();
  }
  function cosine(Ctor, x) {
    var k, len, y2;
    if (x.isZero())
      return x;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      y2 = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      y2 = "2.3283064365386962890625e-10";
    }
    Ctor.precision += k;
    x = taylorSeries(Ctor, 1, x.times(y2), new Ctor(1));
    for (var i3 = k; i3--; ) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }
    Ctor.precision -= k;
    return x;
  }
  var divide = /* @__PURE__ */ function() {
    function multiplyInteger(x, k, base) {
      var temp, carry = 0, i3 = x.length;
      for (x = x.slice(); i3--; ) {
        temp = x[i3] * k + carry;
        x[i3] = temp % base | 0;
        carry = temp / base | 0;
      }
      if (carry)
        x.unshift(carry);
      return x;
    }
    function compare2(a, b, aL, bL) {
      var i3, r;
      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i3 = r = 0; i3 < aL; i3++) {
          if (a[i3] != b[i3]) {
            r = a[i3] > b[i3] ? 1 : -1;
            break;
          }
        }
      }
      return r;
    }
    function subtract2(a, b, aL, base) {
      var i3 = 0;
      for (; aL--; ) {
        a[aL] -= i3;
        i3 = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i3 * base + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; )
        a.shift();
    }
    return function(x, y2, pr, rm, dp, base) {
      var cmp, e3, i3, k, logBase, more, prod2, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign4 = x.s == y2.s ? 1 : -1, xd = x.d, yd = y2.d;
      if (!xd || !xd[0] || !yd || !yd[0]) {
        return new Ctor(
          // Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y2.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : (
            // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
            xd && xd[0] == 0 || !yd ? sign4 * 0 : sign4 / 0
          )
        );
      }
      if (base) {
        logBase = 1;
        e3 = x.e - y2.e;
      } else {
        base = BASE;
        logBase = LOG_BASE;
        e3 = mathfloor(x.e / logBase) - mathfloor(y2.e / logBase);
      }
      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign4);
      qd = q.d = [];
      for (i3 = 0; yd[i3] == (xd[i3] || 0); i3++)
        ;
      if (yd[i3] > (xd[i3] || 0))
        e3--;
      if (pr == null) {
        sd = pr = Ctor.precision;
        rm = Ctor.rounding;
      } else if (dp) {
        sd = pr + (x.e - y2.e) + 1;
      } else {
        sd = pr;
      }
      if (sd < 0) {
        qd.push(1);
        more = true;
      } else {
        sd = sd / logBase + 2 | 0;
        i3 = 0;
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;
          for (; (i3 < xL || k) && sd--; i3++) {
            t = k * base + (xd[i3] || 0);
            qd[i3] = t / yd | 0;
            k = t % yd | 0;
          }
          more = k || i3 < xL;
        } else {
          k = base / (yd[0] + 1) | 0;
          if (k > 1) {
            yd = multiplyInteger(yd, k, base);
            xd = multiplyInteger(xd, k, base);
            yL = yd.length;
            xL = xd.length;
          }
          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;
          for (; remL < yL; )
            rem[remL++] = 0;
          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];
          if (yd[1] >= base / 2)
            ++yd0;
          do {
            k = 0;
            cmp = compare2(yd, rem, yL, remL);
            if (cmp < 0) {
              rem0 = rem[0];
              if (yL != remL)
                rem0 = rem0 * base + (rem[1] || 0);
              k = rem0 / yd0 | 0;
              if (k > 1) {
                if (k >= base)
                  k = base - 1;
                prod2 = multiplyInteger(yd, k, base);
                prodL = prod2.length;
                remL = rem.length;
                cmp = compare2(prod2, rem, prodL, remL);
                if (cmp == 1) {
                  k--;
                  subtract2(prod2, yL < prodL ? yz : yd, prodL, base);
                }
              } else {
                if (k == 0)
                  cmp = k = 1;
                prod2 = yd.slice();
              }
              prodL = prod2.length;
              if (prodL < remL)
                prod2.unshift(0);
              subtract2(rem, prod2, remL, base);
              if (cmp == -1) {
                remL = rem.length;
                cmp = compare2(yd, rem, yL, remL);
                if (cmp < 1) {
                  k++;
                  subtract2(rem, yL < remL ? yz : yd, remL, base);
                }
              }
              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }
            qd[i3++] = k;
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] !== void 0) && sd--);
          more = rem[0] !== void 0;
        }
        if (!qd[0])
          qd.shift();
      }
      if (logBase == 1) {
        q.e = e3;
        inexact = more;
      } else {
        for (i3 = 1, k = qd[0]; k >= 10; k /= 10)
          i3++;
        q.e = i3 + e3 * logBase - 1;
        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }
      return q;
    };
  }();
  function finalise(x, sd, rm, isTruncated) {
    var digits2, i3, j, k, rd, roundUp, w2, xd, xdi, Ctor = x.constructor;
    out:
      if (sd != null) {
        xd = x.d;
        if (!xd)
          return x;
        for (digits2 = 1, k = xd[0]; k >= 10; k /= 10)
          digits2++;
        i3 = sd - digits2;
        if (i3 < 0) {
          i3 += LOG_BASE;
          j = sd;
          w2 = xd[xdi = 0];
          rd = w2 / mathpow(10, digits2 - j - 1) % 10 | 0;
        } else {
          xdi = Math.ceil((i3 + 1) / LOG_BASE);
          k = xd.length;
          if (xdi >= k) {
            if (isTruncated) {
              for (; k++ <= xdi; )
                xd.push(0);
              w2 = rd = 0;
              digits2 = 1;
              i3 %= LOG_BASE;
              j = i3 - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            w2 = k = xd[xdi];
            for (digits2 = 1; k >= 10; k /= 10)
              digits2++;
            i3 %= LOG_BASE;
            j = i3 - LOG_BASE + digits2;
            rd = j < 0 ? 0 : w2 / mathpow(10, digits2 - j - 1) % 10 | 0;
          }
        }
        isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w2 : w2 % mathpow(10, digits2 - j - 1));
        roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (i3 > 0 ? j > 0 ? w2 / mathpow(10, digits2 - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xd[0]) {
          xd.length = 0;
          if (roundUp) {
            sd -= x.e + 1;
            xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
            x.e = -sd || 0;
          } else {
            xd[0] = x.e = 0;
          }
          return x;
        }
        if (i3 == 0) {
          xd.length = xdi;
          k = 1;
          xdi--;
        } else {
          xd.length = xdi + 1;
          k = mathpow(10, LOG_BASE - i3);
          xd[xdi] = j > 0 ? (w2 / mathpow(10, digits2 - j) % mathpow(10, j) | 0) * k : 0;
        }
        if (roundUp) {
          for (; ; ) {
            if (xdi == 0) {
              for (i3 = 1, j = xd[0]; j >= 10; j /= 10)
                i3++;
              j = xd[0] += k;
              for (k = 1; j >= 10; j /= 10)
                k++;
              if (i3 != k) {
                x.e++;
                if (xd[0] == BASE)
                  xd[0] = 1;
              }
              break;
            } else {
              xd[xdi] += k;
              if (xd[xdi] != BASE)
                break;
              xd[xdi--] = 0;
              k = 1;
            }
          }
        }
        for (i3 = xd.length; xd[--i3] === 0; )
          xd.pop();
      }
    if (external) {
      if (x.e > Ctor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < Ctor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
    return x;
  }
  function finiteToString(x, isExp, sd) {
    if (!x.isFinite())
      return nonFiniteToString(x);
    var k, e3 = x.e, str = digitsToString(x.d), len = str.length;
    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + "." + str.slice(1);
      }
      str = str + (x.e < 0 ? "e" : "e+") + x.e;
    } else if (e3 < 0) {
      str = "0." + getZeroString(-e3 - 1) + str;
      if (sd && (k = sd - len) > 0)
        str += getZeroString(k);
    } else if (e3 >= len) {
      str += getZeroString(e3 + 1 - len);
      if (sd && (k = sd - e3 - 1) > 0)
        str = str + "." + getZeroString(k);
    } else {
      if ((k = e3 + 1) < len)
        str = str.slice(0, k) + "." + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e3 + 1 === len)
          str += ".";
        str += getZeroString(k);
      }
    }
    return str;
  }
  function getBase10Exponent(digits2, e3) {
    var w2 = digits2[0];
    for (e3 *= LOG_BASE; w2 >= 10; w2 /= 10)
      e3++;
    return e3;
  }
  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {
      external = true;
      if (pr)
        Ctor.precision = pr;
      throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
  }
  function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION)
      throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
  }
  function getPrecision(digits2) {
    var w2 = digits2.length - 1, len = w2 * LOG_BASE + 1;
    w2 = digits2[w2];
    if (w2) {
      for (; w2 % 10 == 0; w2 /= 10)
        len--;
      for (w2 = digits2[0]; w2 >= 10; w2 /= 10)
        len++;
    }
    return len;
  }
  function getZeroString(k) {
    var zs = "";
    for (; k--; )
      zs += "0";
    return zs;
  }
  function intPow(Ctor, x, n, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for (; ; ) {
      if (n % 2) {
        r = r.times(x);
        if (truncate(r.d, k))
          isTruncated = true;
      }
      n = mathfloor(n / 2);
      if (n === 0) {
        n = r.d.length - 1;
        if (isTruncated && r.d[n] === 0)
          ++r.d[n];
        break;
      }
      x = x.times(x);
      truncate(x.d, k);
    }
    external = true;
    return r;
  }
  function isOdd(n) {
    return n.d[n.d.length - 1] & 1;
  }
  function maxOrMin(Ctor, args, ltgt) {
    var y2, x = new Ctor(args[0]), i3 = 0;
    for (; ++i3 < args.length; ) {
      y2 = new Ctor(args[i3]);
      if (!y2.s) {
        x = y2;
        break;
      } else if (x[ltgt](y2)) {
        x = y2;
      }
    }
    return x;
  }
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow3, sum3, t, wpr, rep = 0, i3 = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (!x.d || !x.d[0] || x.e > 17) {
      return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    t = new Ctor(0.03125);
    while (x.e > -2) {
      x = x.times(t);
      k += 5;
    }
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow3 = sum3 = new Ctor(1);
    Ctor.precision = wpr;
    for (; ; ) {
      pow3 = finalise(pow3.times(x), wpr, 1);
      denominator = denominator.times(++i3);
      t = sum3.plus(divide(pow3, denominator, wpr, 1));
      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum3.d).slice(0, wpr)) {
        j = k;
        while (j--)
          sum3 = finalise(sum3.times(sum3), wpr, 1);
        if (sd == null) {
          if (rep < 3 && checkRoundingDigits(sum3.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += 10;
            denominator = pow3 = t = new Ctor(1);
            i3 = 0;
            rep++;
          } else {
            return finalise(sum3, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum3;
        }
      }
      sum3 = t;
    }
  }
  function naturalLogarithm(y2, sd) {
    var c, c0, denominator, e3, numerator, rep, sum3, t, wpr, x1, x2, n = 1, guard = 10, x = y2, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);
    if (Math.abs(e3 = x.e) < 15e14) {
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y2);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }
      e3 = x.e;
      if (c0 > 1) {
        x = new Ctor("0." + c);
        e3++;
      } else {
        x = new Ctor(c0 + "." + c.slice(1));
      }
    } else {
      t = getLn10(Ctor, wpr + 2, pr).times(e3 + "");
      x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;
      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }
    x1 = x;
    sum3 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;
    for (; ; ) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum3.plus(divide(numerator, new Ctor(denominator), wpr, 1));
      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum3.d).slice(0, wpr)) {
        sum3 = sum3.times(2);
        if (e3 !== 0)
          sum3 = sum3.plus(getLn10(Ctor, wpr + 2, pr).times(e3 + ""));
        sum3 = divide(sum3, new Ctor(n), wpr, 1);
        if (sd == null) {
          if (checkRoundingDigits(sum3.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += guard;
            t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x.times(x), wpr, 1);
            denominator = rep = 1;
          } else {
            return finalise(sum3, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum3;
        }
      }
      sum3 = t;
      denominator += 2;
    }
  }
  function nonFiniteToString(x) {
    return String(x.s * x.s / 0);
  }
  function parseDecimal(x, str) {
    var e3, i3, len;
    if ((e3 = str.indexOf(".")) > -1)
      str = str.replace(".", "");
    if ((i3 = str.search(/e/i)) > 0) {
      if (e3 < 0)
        e3 = i3;
      e3 += +str.slice(i3 + 1);
      str = str.substring(0, i3);
    } else if (e3 < 0) {
      e3 = str.length;
    }
    for (i3 = 0; str.charCodeAt(i3) === 48; i3++)
      ;
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len)
      ;
    str = str.slice(i3, len);
    if (str) {
      len -= i3;
      x.e = e3 = e3 - i3 - 1;
      x.d = [];
      i3 = (e3 + 1) % LOG_BASE;
      if (e3 < 0)
        i3 += LOG_BASE;
      if (i3 < len) {
        if (i3)
          x.d.push(+str.slice(0, i3));
        for (len -= LOG_BASE; i3 < len; )
          x.d.push(+str.slice(i3, i3 += LOG_BASE));
        str = str.slice(i3);
        i3 = LOG_BASE - str.length;
      } else {
        i3 -= len;
      }
      for (; i3--; )
        str += "0";
      x.d.push(+str);
      if (external) {
        if (x.e > x.constructor.maxE) {
          x.d = null;
          x.e = NaN;
        } else if (x.e < x.constructor.minE) {
          x.e = 0;
          x.d = [0];
        }
      }
    } else {
      x.e = 0;
      x.d = [0];
    }
    return x;
  }
  function parseOther(x, str) {
    var base, Ctor, divisor, i3, isFloat, len, p, xd, xe;
    if (str.indexOf("_") > -1) {
      str = str.replace(/(\d)_(?=\d)/g, "$1");
      if (isDecimal.test(str))
        return parseDecimal(x, str);
    } else if (str === "Infinity" || str === "NaN") {
      if (!+str)
        x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
    }
    if (isHex.test(str)) {
      base = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str)) {
      base = 2;
    } else if (isOctal.test(str)) {
      base = 8;
    } else {
      throw Error(invalidArgument + str);
    }
    i3 = str.search(/p/i);
    if (i3 > 0) {
      p = +str.slice(i3 + 1);
      str = str.substring(2, i3);
    } else {
      str = str.slice(2);
    }
    i3 = str.indexOf(".");
    isFloat = i3 >= 0;
    Ctor = x.constructor;
    if (isFloat) {
      str = str.replace(".", "");
      len = str.length;
      i3 = len - i3;
      divisor = intPow(Ctor, new Ctor(base), i3, i3 * 2);
    }
    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;
    for (i3 = xe; xd[i3] === 0; --i3)
      xd.pop();
    if (i3 < 0)
      return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;
    if (isFloat)
      x = divide(x, divisor, len * 4);
    if (p)
      x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;
    return x;
  }
  function sine(Ctor, x) {
    var k, len = x.d.length;
    if (len < 3) {
      return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
    }
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x);
    var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }
    return x;
  }
  function taylorSeries(Ctor, n, x, y2, isHyperbolic) {
    var j, t, u, x2, i3 = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x2 = x.times(x);
    u = new Ctor(y2);
    for (; ; ) {
      t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
      u = isHyperbolic ? y2.plus(t) : y2.minus(t);
      y2 = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
      t = u.plus(y2);
      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--; )
          ;
        if (j == -1)
          break;
      }
      j = u;
      u = y2;
      y2 = t;
      t = j;
      i3++;
    }
    external = true;
    t.d.length = k + 1;
    return t;
  }
  function tinyPow(b, e3) {
    var n = b;
    while (--e3)
      n *= b;
    return n;
  }
  function toLessThanHalfPi(Ctor, x) {
    var t, isNeg = x.s < 0, pi3 = getPi(Ctor, Ctor.precision, 1), halfPi = pi3.times(0.5);
    x = x.abs();
    if (x.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x;
    }
    t = x.divToInt(pi3);
    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x = x.minus(t.times(pi3));
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
        return x;
      }
      quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
    }
    return x.minus(pi3).abs();
  }
  function toStringBinary(x, baseOut, sd, rm) {
    var base, e3, i3, k, len, roundUp, str, xd, y2, Ctor = x.constructor, isExp = sd !== void 0;
    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0)
        rm = Ctor.rounding;
      else
        checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }
    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
      i3 = str.indexOf(".");
      if (isExp) {
        base = 2;
        if (baseOut == 16) {
          sd = sd * 4 - 3;
        } else if (baseOut == 8) {
          sd = sd * 3 - 2;
        }
      } else {
        base = baseOut;
      }
      if (i3 >= 0) {
        str = str.replace(".", "");
        y2 = new Ctor(1);
        y2.e = str.length - i3;
        y2.d = convertBase(finiteToString(y2), 10, base);
        y2.e = y2.d.length;
      }
      xd = convertBase(str, 10, base);
      e3 = len = xd.length;
      for (; xd[--len] == 0; )
        xd.pop();
      if (!xd[0]) {
        str = isExp ? "0p+0" : "0";
      } else {
        if (i3 < 0) {
          e3--;
        } else {
          x = new Ctor(x);
          x.d = xd;
          x.e = e3;
          x = divide(x, y2, sd, rm, 0, base);
          xd = x.d;
          e3 = x.e;
          roundUp = inexact;
        }
        i3 = xd[sd];
        k = base / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;
        roundUp = rm < 4 ? (i3 !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i3 > k || i3 === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
        xd.length = sd;
        if (roundUp) {
          for (; ++xd[--sd] > base - 1; ) {
            xd[sd] = 0;
            if (!sd) {
              ++e3;
              xd.unshift(1);
            }
          }
        }
        for (len = xd.length; !xd[len - 1]; --len)
          ;
        for (i3 = 0, str = ""; i3 < len; i3++)
          str += NUMERALS.charAt(xd[i3]);
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i3 = baseOut == 16 ? 4 : 3;
              for (--len; len % i3; len++)
                str += "0";
              xd = convertBase(str, base, baseOut);
              for (len = xd.length; !xd[len - 1]; --len)
                ;
              for (i3 = 1, str = "1."; i3 < len; i3++)
                str += NUMERALS.charAt(xd[i3]);
            } else {
              str = str.charAt(0) + "." + str.slice(1);
            }
          }
          str = str + (e3 < 0 ? "p" : "p+") + e3;
        } else if (e3 < 0) {
          for (; ++e3; )
            str = "0" + str;
          str = "0." + str;
        } else {
          if (++e3 > len)
            for (e3 -= len; e3--; )
              str += "0";
          else if (e3 < len)
            str = str.slice(0, e3) + "." + str.slice(e3);
        }
      }
      str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
    }
    return x.s < 0 ? "-" + str : str;
  }
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }
  function abs(x) {
    return new this(x).abs();
  }
  function acos(x) {
    return new this(x).acos();
  }
  function acosh2(x) {
    return new this(x).acosh();
  }
  function add(x, y2) {
    return new this(x).plus(y2);
  }
  function asin(x) {
    return new this(x).asin();
  }
  function asinh2(x) {
    return new this(x).asinh();
  }
  function atan(x) {
    return new this(x).atan();
  }
  function atanh2(x) {
    return new this(x).atanh();
  }
  function atan2(y2, x) {
    y2 = new this(y2);
    x = new this(x);
    var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
    if (!y2.s || !x.s) {
      r = new this(NaN);
    } else if (!y2.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
      r.s = y2.s;
    } else if (!x.d || y2.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y2.s;
    } else if (!y2.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y2.s;
    } else if (x.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y2, x, wpr, 1));
      x = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y2.s < 0 ? r.minus(x) : r.plus(x);
    } else {
      r = this.atan(divide(y2, x, wpr, 1));
    }
    return r;
  }
  function cbrt3(x) {
    return new this(x).cbrt();
  }
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }
  function clamp(x, min3, max3) {
    return new this(x).clamp(min3, max3);
  }
  function config3(obj) {
    if (!obj || typeof obj !== "object")
      throw Error(decimalError + "Object expected");
    var i3, p, v, useDefaults = obj.defaults === true, ps = [
      "precision",
      1,
      MAX_DIGITS,
      "rounding",
      0,
      8,
      "toExpNeg",
      -EXP_LIMIT,
      0,
      "toExpPos",
      0,
      EXP_LIMIT,
      "maxE",
      0,
      EXP_LIMIT,
      "minE",
      -EXP_LIMIT,
      0,
      "modulo",
      0,
      9
    ];
    for (i3 = 0; i3 < ps.length; i3 += 3) {
      if (p = ps[i3], useDefaults)
        this[p] = DEFAULTS[p];
      if ((v = obj[p]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i3 + 1] && v <= ps[i3 + 2])
          this[p] = v;
        else
          throw Error(invalidArgument + p + ": " + v);
      }
    }
    if (p = "crypto", useDefaults)
      this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ": " + v);
      }
    }
    return this;
  }
  function cos(x) {
    return new this(x).cos();
  }
  function cosh2(x) {
    return new this(x).cosh();
  }
  function clone3(obj) {
    var i3, p, ps;
    function Decimal2(v) {
      var e3, i4, t, x = this;
      if (!(x instanceof Decimal2))
        return new Decimal2(v);
      x.constructor = Decimal2;
      if (isDecimalInstance(v)) {
        x.s = v.s;
        if (external) {
          if (!v.d || v.e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (v.e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = v.e;
            x.d = v.d.slice();
          }
        } else {
          x.e = v.e;
          x.d = v.d ? v.d.slice() : v.d;
        }
        return;
      }
      t = typeof v;
      if (t === "number") {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [0];
          return;
        }
        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }
        if (v === ~~v && v < 1e7) {
          for (e3 = 0, i4 = v; i4 >= 10; i4 /= 10)
            e3++;
          if (external) {
            if (e3 > Decimal2.maxE) {
              x.e = NaN;
              x.d = null;
            } else if (e3 < Decimal2.minE) {
              x.e = 0;
              x.d = [0];
            } else {
              x.e = e3;
              x.d = [v];
            }
          } else {
            x.e = e3;
            x.d = [v];
          }
          return;
        } else if (v * 0 !== 0) {
          if (!v)
            x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }
        return parseDecimal(x, v.toString());
      } else if (t !== "string") {
        throw Error(invalidArgument + v);
      }
      if ((i4 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        if (i4 === 43)
          v = v.slice(1);
        x.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }
    Decimal2.prototype = P;
    Decimal2.ROUND_UP = 0;
    Decimal2.ROUND_DOWN = 1;
    Decimal2.ROUND_CEIL = 2;
    Decimal2.ROUND_FLOOR = 3;
    Decimal2.ROUND_HALF_UP = 4;
    Decimal2.ROUND_HALF_DOWN = 5;
    Decimal2.ROUND_HALF_EVEN = 6;
    Decimal2.ROUND_HALF_CEIL = 7;
    Decimal2.ROUND_HALF_FLOOR = 8;
    Decimal2.EUCLID = 9;
    Decimal2.config = Decimal2.set = config3;
    Decimal2.clone = clone3;
    Decimal2.isDecimal = isDecimalInstance;
    Decimal2.abs = abs;
    Decimal2.acos = acos;
    Decimal2.acosh = acosh2;
    Decimal2.add = add;
    Decimal2.asin = asin;
    Decimal2.asinh = asinh2;
    Decimal2.atan = atan;
    Decimal2.atanh = atanh2;
    Decimal2.atan2 = atan2;
    Decimal2.cbrt = cbrt3;
    Decimal2.ceil = ceil;
    Decimal2.clamp = clamp;
    Decimal2.cos = cos;
    Decimal2.cosh = cosh2;
    Decimal2.div = div;
    Decimal2.exp = exp;
    Decimal2.floor = floor;
    Decimal2.hypot = hypot;
    Decimal2.ln = ln;
    Decimal2.log = log;
    Decimal2.log10 = log103;
    Decimal2.log2 = log23;
    Decimal2.max = max;
    Decimal2.min = min;
    Decimal2.mod = mod;
    Decimal2.mul = mul;
    Decimal2.pow = pow;
    Decimal2.random = random;
    Decimal2.round = round;
    Decimal2.sign = sign2;
    Decimal2.sin = sin;
    Decimal2.sinh = sinh2;
    Decimal2.sqrt = sqrt;
    Decimal2.sub = sub;
    Decimal2.sum = sum;
    Decimal2.tan = tan;
    Decimal2.tanh = tanh2;
    Decimal2.trunc = trunc;
    if (obj === void 0)
      obj = {};
    if (obj) {
      if (obj.defaults !== true) {
        ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
        for (i3 = 0; i3 < ps.length; )
          if (!obj.hasOwnProperty(p = ps[i3++]))
            obj[p] = this[p];
      }
    }
    Decimal2.config(obj);
    return Decimal2;
  }
  function div(x, y2) {
    return new this(x).div(y2);
  }
  function exp(x) {
    return new this(x).exp();
  }
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
  }
  function hypot() {
    var i3, n, t = new this(0);
    external = false;
    for (i3 = 0; i3 < arguments.length; ) {
      n = new this(arguments[i3++]);
      if (!n.d) {
        if (n.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n;
      } else if (t.d) {
        t = t.plus(n.times(n));
      }
    }
    external = true;
    return t.sqrt();
  }
  function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
  }
  function ln(x) {
    return new this(x).ln();
  }
  function log(x, y2) {
    return new this(x).log(y2);
  }
  function log23(x) {
    return new this(x).log(2);
  }
  function log103(x) {
    return new this(x).log(10);
  }
  function max() {
    return maxOrMin(this, arguments, "lt");
  }
  function min() {
    return maxOrMin(this, arguments, "gt");
  }
  function mod(x, y2) {
    return new this(x).mod(y2);
  }
  function mul(x, y2) {
    return new this(x).mul(y2);
  }
  function pow(x, y2) {
    return new this(x).pow(y2);
  }
  function random(sd) {
    var d, e3, k, n, i3 = 0, r = new this(1), rd = [];
    if (sd === void 0)
      sd = this.precision;
    else
      checkInt32(sd, 1, MAX_DIGITS);
    k = Math.ceil(sd / LOG_BASE);
    if (!this.crypto) {
      for (; i3 < k; )
        rd[i3++] = Math.random() * 1e7 | 0;
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));
      for (; i3 < k; ) {
        n = d[i3];
        if (n >= 429e7) {
          d[i3] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {
          rd[i3++] = n % 1e7;
        }
      }
    } else if (crypto.randomBytes) {
      d = crypto.randomBytes(k *= 4);
      for (; i3 < k; ) {
        n = d[i3] + (d[i3 + 1] << 8) + (d[i3 + 2] << 16) + ((d[i3 + 3] & 127) << 24);
        if (n >= 214e7) {
          crypto.randomBytes(4).copy(d, i3);
        } else {
          rd.push(n % 1e7);
          i3 += 4;
        }
      }
      i3 = k / 4;
    } else {
      throw Error(cryptoUnavailable);
    }
    k = rd[--i3];
    sd %= LOG_BASE;
    if (k && sd) {
      n = mathpow(10, LOG_BASE - sd);
      rd[i3] = (k / n | 0) * n;
    }
    for (; rd[i3] === 0; i3--)
      rd.pop();
    if (i3 < 0) {
      e3 = 0;
      rd = [0];
    } else {
      e3 = -1;
      for (; rd[0] === 0; e3 -= LOG_BASE)
        rd.shift();
      for (k = 1, n = rd[0]; n >= 10; n /= 10)
        k++;
      if (k < LOG_BASE)
        e3 -= LOG_BASE - k;
    }
    r.e = e3;
    r.d = rd;
    return r;
  }
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }
  function sign2(x) {
    x = new this(x);
    return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
  }
  function sin(x) {
    return new this(x).sin();
  }
  function sinh2(x) {
    return new this(x).sinh();
  }
  function sqrt(x) {
    return new this(x).sqrt();
  }
  function sub(x, y2) {
    return new this(x).sub(y2);
  }
  function sum() {
    var i3 = 0, args = arguments, x = new this(args[i3]);
    external = false;
    for (; x.s && ++i3 < args.length; )
      x = x.plus(args[i3]);
    external = true;
    return finalise(x, this.precision, this.rounding);
  }
  function tan(x) {
    return new this(x).tan();
  }
  function tanh2(x) {
    return new this(x).tanh();
  }
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }
  P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
  P[Symbol.toStringTag] = "Decimal";
  var Decimal = P.constructor = clone3(DEFAULTS);
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);
  var decimal_default = Decimal;

  // node_modules/mathjs/lib/esm/type/bignumber/BigNumber.js
  var name2 = "BigNumber";
  var dependencies3 = ["?on", "config"];
  var createBigNumberClass = /* @__PURE__ */ factory(name2, dependencies3, (_ref) => {
    var {
      on,
      config: config4
    } = _ref;
    var BigNumber2 = decimal_default.clone({
      precision: config4.precision,
      modulo: decimal_default.EUCLID
    });
    BigNumber2.prototype = Object.create(BigNumber2.prototype);
    BigNumber2.prototype.type = "BigNumber";
    BigNumber2.prototype.isBigNumber = true;
    BigNumber2.prototype.toJSON = function() {
      return {
        mathjs: "BigNumber",
        value: this.toString()
      };
    };
    BigNumber2.fromJSON = function(json) {
      return new BigNumber2(json.value);
    };
    if (on) {
      on("config", function(curr, prev) {
        if (curr.precision !== prev.precision) {
          BigNumber2.config({
            precision: curr.precision
          });
        }
      });
    }
    return BigNumber2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/complex/Complex.js
  var import_complex = __toESM(require_complex(), 1);
  var name3 = "Complex";
  var dependencies4 = [];
  var createComplexClass = /* @__PURE__ */ factory(name3, dependencies4, () => {
    Object.defineProperty(import_complex.default, "name", {
      value: "Complex"
    });
    import_complex.default.prototype.constructor = import_complex.default;
    import_complex.default.prototype.type = "Complex";
    import_complex.default.prototype.isComplex = true;
    import_complex.default.prototype.toJSON = function() {
      return {
        mathjs: "Complex",
        re: this.re,
        im: this.im
      };
    };
    import_complex.default.prototype.toPolar = function() {
      return {
        r: this.abs(),
        phi: this.arg()
      };
    };
    import_complex.default.prototype.format = function(options) {
      var str = "";
      var im2 = this.im;
      var re2 = this.re;
      var strRe = format(this.re, options);
      var strIm = format(this.im, options);
      var precision = isNumber(options) ? options : options ? options.precision : null;
      if (precision !== null) {
        var epsilon = Math.pow(10, -precision);
        if (Math.abs(re2 / im2) < epsilon) {
          re2 = 0;
        }
        if (Math.abs(im2 / re2) < epsilon) {
          im2 = 0;
        }
      }
      if (im2 === 0) {
        str = strRe;
      } else if (re2 === 0) {
        if (im2 === 1) {
          str = "i";
        } else if (im2 === -1) {
          str = "-i";
        } else {
          str = strIm + "i";
        }
      } else {
        if (im2 < 0) {
          if (im2 === -1) {
            str = strRe + " - i";
          } else {
            str = strRe + " - " + strIm.substring(1) + "i";
          }
        } else {
          if (im2 === 1) {
            str = strRe + " + i";
          } else {
            str = strRe + " + " + strIm + "i";
          }
        }
      }
      return str;
    };
    import_complex.default.fromPolar = function(args) {
      switch (arguments.length) {
        case 1: {
          var arg2 = arguments[0];
          if (typeof arg2 === "object") {
            return (0, import_complex.default)(arg2);
          } else {
            throw new TypeError("Input has to be an object with r and phi keys.");
          }
        }
        case 2: {
          var r = arguments[0];
          var phi3 = arguments[1];
          if (isNumber(r)) {
            if (isUnit(phi3) && phi3.hasBase("ANGLE")) {
              phi3 = phi3.toNumber("rad");
            }
            if (isNumber(phi3)) {
              return new import_complex.default({
                r,
                phi: phi3
              });
            }
            throw new TypeError("Phi is not a number nor an angle unit.");
          } else {
            throw new TypeError("Radius r is not a number.");
          }
        }
        default:
          throw new SyntaxError("Wrong number of arguments in function fromPolar");
      }
    };
    import_complex.default.prototype.valueOf = import_complex.default.prototype.toString;
    import_complex.default.fromJSON = function(json) {
      return new import_complex.default(json);
    };
    import_complex.default.compare = function(a, b) {
      if (a.re > b.re) {
        return 1;
      }
      if (a.re < b.re) {
        return -1;
      }
      if (a.im > b.im) {
        return 1;
      }
      if (a.im < b.im) {
        return -1;
      }
      return 0;
    };
    return import_complex.default;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/fraction/Fraction.js
  var import_fraction = __toESM(require_fraction(), 1);
  var name4 = "Fraction";
  var dependencies5 = [];
  var createFractionClass = /* @__PURE__ */ factory(name4, dependencies5, () => {
    Object.defineProperty(import_fraction.default, "name", {
      value: "Fraction"
    });
    import_fraction.default.prototype.constructor = import_fraction.default;
    import_fraction.default.prototype.type = "Fraction";
    import_fraction.default.prototype.isFraction = true;
    import_fraction.default.prototype.toJSON = function() {
      return {
        mathjs: "Fraction",
        n: this.s * this.n,
        d: this.d
      };
    };
    import_fraction.default.fromJSON = function(json) {
      return new import_fraction.default(json);
    };
    return import_fraction.default;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/matrix/Range.js
  var name5 = "Range";
  var dependencies6 = [];
  var createRangeClass = /* @__PURE__ */ factory(name5, dependencies6, () => {
    function Range2(start, end, step) {
      if (!(this instanceof Range2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      var hasStart = start !== null && start !== void 0;
      var hasEnd = end !== null && end !== void 0;
      var hasStep = step !== null && step !== void 0;
      if (hasStart) {
        if (isBigNumber(start)) {
          start = start.toNumber();
        } else if (typeof start !== "number") {
          throw new TypeError("Parameter start must be a number");
        }
      }
      if (hasEnd) {
        if (isBigNumber(end)) {
          end = end.toNumber();
        } else if (typeof end !== "number") {
          throw new TypeError("Parameter end must be a number");
        }
      }
      if (hasStep) {
        if (isBigNumber(step)) {
          step = step.toNumber();
        } else if (typeof step !== "number") {
          throw new TypeError("Parameter step must be a number");
        }
      }
      this.start = hasStart ? parseFloat(start) : 0;
      this.end = hasEnd ? parseFloat(end) : 0;
      this.step = hasStep ? parseFloat(step) : 1;
    }
    Range2.prototype.type = "Range";
    Range2.prototype.isRange = true;
    Range2.parse = function(str) {
      if (typeof str !== "string") {
        return null;
      }
      var args = str.split(":");
      var nums = args.map(function(arg2) {
        return parseFloat(arg2);
      });
      var invalid = nums.some(function(num) {
        return isNaN(num);
      });
      if (invalid) {
        return null;
      }
      switch (nums.length) {
        case 2:
          return new Range2(nums[0], nums[1]);
        case 3:
          return new Range2(nums[0], nums[2], nums[1]);
        default:
          return null;
      }
    };
    Range2.prototype.clone = function() {
      return new Range2(this.start, this.end, this.step);
    };
    Range2.prototype.size = function() {
      var len = 0;
      var start = this.start;
      var step = this.step;
      var end = this.end;
      var diff2 = end - start;
      if (sign(step) === sign(diff2)) {
        len = Math.ceil(diff2 / step);
      } else if (diff2 === 0) {
        len = 0;
      }
      if (isNaN(len)) {
        len = 0;
      }
      return [len];
    };
    Range2.prototype.min = function() {
      var size2 = this.size()[0];
      if (size2 > 0) {
        if (this.step > 0) {
          return this.start;
        } else {
          return this.start + (size2 - 1) * this.step;
        }
      } else {
        return void 0;
      }
    };
    Range2.prototype.max = function() {
      var size2 = this.size()[0];
      if (size2 > 0) {
        if (this.step > 0) {
          return this.start + (size2 - 1) * this.step;
        } else {
          return this.start;
        }
      } else {
        return void 0;
      }
    };
    Range2.prototype.forEach = function(callback) {
      var x = this.start;
      var step = this.step;
      var end = this.end;
      var i3 = 0;
      if (step > 0) {
        while (x < end) {
          callback(x, [i3], this);
          x += step;
          i3++;
        }
      } else if (step < 0) {
        while (x > end) {
          callback(x, [i3], this);
          x += step;
          i3++;
        }
      }
    };
    Range2.prototype.map = function(callback) {
      var array = [];
      this.forEach(function(value, index2, obj) {
        array[index2[0]] = callback(value, index2, obj);
      });
      return array;
    };
    Range2.prototype.toArray = function() {
      var array = [];
      this.forEach(function(value, index2) {
        array[index2[0]] = value;
      });
      return array;
    };
    Range2.prototype.valueOf = function() {
      return this.toArray();
    };
    Range2.prototype.format = function(options) {
      var str = format(this.start, options);
      if (this.step !== 1) {
        str += ":" + format(this.step, options);
      }
      str += ":" + format(this.end, options);
      return str;
    };
    Range2.prototype.toString = function() {
      return this.format();
    };
    Range2.prototype.toJSON = function() {
      return {
        mathjs: "Range",
        start: this.start,
        end: this.end,
        step: this.step
      };
    };
    Range2.fromJSON = function(json) {
      return new Range2(json.start, json.end, json.step);
    };
    return Range2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/matrix/Matrix.js
  var name6 = "Matrix";
  var dependencies7 = [];
  var createMatrixClass = /* @__PURE__ */ factory(name6, dependencies7, () => {
    function Matrix2() {
      if (!(this instanceof Matrix2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
    }
    Matrix2.prototype.type = "Matrix";
    Matrix2.prototype.isMatrix = true;
    Matrix2.prototype.storage = function() {
      throw new Error("Cannot invoke storage on a Matrix interface");
    };
    Matrix2.prototype.datatype = function() {
      throw new Error("Cannot invoke datatype on a Matrix interface");
    };
    Matrix2.prototype.create = function(data, datatype) {
      throw new Error("Cannot invoke create on a Matrix interface");
    };
    Matrix2.prototype.subset = function(index2, replacement, defaultValue) {
      throw new Error("Cannot invoke subset on a Matrix interface");
    };
    Matrix2.prototype.get = function(index2) {
      throw new Error("Cannot invoke get on a Matrix interface");
    };
    Matrix2.prototype.set = function(index2, value, defaultValue) {
      throw new Error("Cannot invoke set on a Matrix interface");
    };
    Matrix2.prototype.resize = function(size2, defaultValue) {
      throw new Error("Cannot invoke resize on a Matrix interface");
    };
    Matrix2.prototype.reshape = function(size2, defaultValue) {
      throw new Error("Cannot invoke reshape on a Matrix interface");
    };
    Matrix2.prototype.clone = function() {
      throw new Error("Cannot invoke clone on a Matrix interface");
    };
    Matrix2.prototype.size = function() {
      throw new Error("Cannot invoke size on a Matrix interface");
    };
    Matrix2.prototype.map = function(callback, skipZeros) {
      throw new Error("Cannot invoke map on a Matrix interface");
    };
    Matrix2.prototype.forEach = function(callback) {
      throw new Error("Cannot invoke forEach on a Matrix interface");
    };
    Matrix2.prototype[Symbol.iterator] = function() {
      throw new Error("Cannot iterate a Matrix interface");
    };
    Matrix2.prototype.toArray = function() {
      throw new Error("Cannot invoke toArray on a Matrix interface");
    };
    Matrix2.prototype.valueOf = function() {
      throw new Error("Cannot invoke valueOf on a Matrix interface");
    };
    Matrix2.prototype.format = function(options) {
      throw new Error("Cannot invoke format on a Matrix interface");
    };
    Matrix2.prototype.toString = function() {
      throw new Error("Cannot invoke toString on a Matrix interface");
    };
    return Matrix2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/utils/lruQueue.js
  function lruQueue(limit) {
    var size2 = 0;
    var base = 1;
    var queue = /* @__PURE__ */ Object.create(null);
    var map3 = /* @__PURE__ */ Object.create(null);
    var index2 = 0;
    var del = function del2(id) {
      var oldIndex = map3[id];
      if (!oldIndex)
        return;
      delete queue[oldIndex];
      delete map3[id];
      --size2;
      if (base !== oldIndex)
        return;
      if (!size2) {
        index2 = 0;
        base = 1;
        return;
      }
      while (!Object.prototype.hasOwnProperty.call(queue, ++base)) {
      }
    };
    limit = Math.abs(limit);
    return {
      hit: function hit(id) {
        var oldIndex = map3[id];
        var nuIndex = ++index2;
        queue[nuIndex] = id;
        map3[id] = nuIndex;
        if (!oldIndex) {
          ++size2;
          if (size2 <= limit)
            return void 0;
          id = queue[base];
          del(id);
          return id;
        }
        delete queue[oldIndex];
        if (base !== oldIndex)
          return void 0;
        while (!Object.prototype.hasOwnProperty.call(queue, ++base)) {
        }
        return void 0;
      },
      delete: del,
      clear: function clear() {
        size2 = index2 = 0;
        base = 1;
        queue = /* @__PURE__ */ Object.create(null);
        map3 = /* @__PURE__ */ Object.create(null);
      }
    };
  }

  // node_modules/mathjs/lib/esm/utils/function.js
  function memoize(fn) {
    var {
      hasher: hasher2,
      limit
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    limit = limit == null ? Number.POSITIVE_INFINITY : limit;
    hasher2 = hasher2 == null ? JSON.stringify : hasher2;
    return function memoize2() {
      if (typeof memoize2.cache !== "object") {
        memoize2.cache = {
          values: /* @__PURE__ */ new Map(),
          lru: lruQueue(limit || Number.POSITIVE_INFINITY)
        };
      }
      var args = [];
      for (var i3 = 0; i3 < arguments.length; i3++) {
        args[i3] = arguments[i3];
      }
      var hash = hasher2(args);
      if (memoize2.cache.values.has(hash)) {
        memoize2.cache.lru.hit(hash);
        return memoize2.cache.values.get(hash);
      }
      var newVal = fn.apply(fn, args);
      memoize2.cache.values.set(hash, newVal);
      memoize2.cache.values.delete(memoize2.cache.lru.hit(hash));
      return newVal;
    };
  }
  function maxArgumentCount(fn) {
    return Object.keys(fn.signatures || {}).reduce(function(args, signature) {
      var count2 = (signature.match(/,/g) || []).length + 1;
      return Math.max(args, count2);
    }, -1);
  }

  // node_modules/mathjs/lib/esm/type/matrix/DenseMatrix.js
  var name7 = "DenseMatrix";
  var dependencies8 = ["Matrix"];
  var createDenseMatrixClass = /* @__PURE__ */ factory(name7, dependencies8, (_ref) => {
    var {
      Matrix: Matrix2
    } = _ref;
    function DenseMatrix2(data, datatype) {
      if (!(this instanceof DenseMatrix2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      if (datatype && !isString(datatype)) {
        throw new Error("Invalid datatype: " + datatype);
      }
      if (isMatrix(data)) {
        if (data.type === "DenseMatrix") {
          this._data = clone(data._data);
          this._size = clone(data._size);
          this._datatype = datatype || data._datatype;
        } else {
          this._data = data.toArray();
          this._size = data.size();
          this._datatype = datatype || data._datatype;
        }
      } else if (data && isArray(data.data) && isArray(data.size)) {
        this._data = data.data;
        this._size = data.size;
        validate(this._data, this._size);
        this._datatype = datatype || data.datatype;
      } else if (isArray(data)) {
        this._data = preprocess(data);
        this._size = arraySize(this._data);
        validate(this._data, this._size);
        this._datatype = datatype;
      } else if (data) {
        throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
      } else {
        this._data = [];
        this._size = [0];
        this._datatype = datatype;
      }
    }
    DenseMatrix2.prototype = new Matrix2();
    DenseMatrix2.prototype.createDenseMatrix = function(data, datatype) {
      return new DenseMatrix2(data, datatype);
    };
    Object.defineProperty(DenseMatrix2, "name", {
      value: "DenseMatrix"
    });
    DenseMatrix2.prototype.constructor = DenseMatrix2;
    DenseMatrix2.prototype.type = "DenseMatrix";
    DenseMatrix2.prototype.isDenseMatrix = true;
    DenseMatrix2.prototype.getDataType = function() {
      return getArrayDataType(this._data, typeOf);
    };
    DenseMatrix2.prototype.storage = function() {
      return "dense";
    };
    DenseMatrix2.prototype.datatype = function() {
      return this._datatype;
    };
    DenseMatrix2.prototype.create = function(data, datatype) {
      return new DenseMatrix2(data, datatype);
    };
    DenseMatrix2.prototype.subset = function(index2, replacement, defaultValue) {
      switch (arguments.length) {
        case 1:
          return _get(this, index2);
        case 2:
        case 3:
          return _set(this, index2, replacement, defaultValue);
        default:
          throw new SyntaxError("Wrong number of arguments");
      }
    };
    DenseMatrix2.prototype.get = function(index2) {
      if (!isArray(index2)) {
        throw new TypeError("Array expected");
      }
      if (index2.length !== this._size.length) {
        throw new DimensionError(index2.length, this._size.length);
      }
      for (var x = 0; x < index2.length; x++) {
        validateIndex(index2[x], this._size[x]);
      }
      var data = this._data;
      for (var i3 = 0, ii = index2.length; i3 < ii; i3++) {
        var indexI = index2[i3];
        validateIndex(indexI, data.length);
        data = data[indexI];
      }
      return data;
    };
    DenseMatrix2.prototype.set = function(index2, value, defaultValue) {
      if (!isArray(index2)) {
        throw new TypeError("Array expected");
      }
      if (index2.length < this._size.length) {
        throw new DimensionError(index2.length, this._size.length, "<");
      }
      var i3, ii, indexI;
      var size2 = index2.map(function(i4) {
        return i4 + 1;
      });
      _fit(this, size2, defaultValue);
      var data = this._data;
      for (i3 = 0, ii = index2.length - 1; i3 < ii; i3++) {
        indexI = index2[i3];
        validateIndex(indexI, data.length);
        data = data[indexI];
      }
      indexI = index2[index2.length - 1];
      validateIndex(indexI, data.length);
      data[indexI] = value;
      return this;
    };
    function _get(matrix2, index2) {
      if (!isIndex(index2)) {
        throw new TypeError("Invalid index");
      }
      var isScalar = index2.isScalar();
      if (isScalar) {
        return matrix2.get(index2.min());
      } else {
        var size2 = index2.size();
        if (size2.length !== matrix2._size.length) {
          throw new DimensionError(size2.length, matrix2._size.length);
        }
        var min3 = index2.min();
        var max3 = index2.max();
        for (var i3 = 0, ii = matrix2._size.length; i3 < ii; i3++) {
          validateIndex(min3[i3], matrix2._size[i3]);
          validateIndex(max3[i3], matrix2._size[i3]);
        }
        return new DenseMatrix2(_getSubmatrix(matrix2._data, index2, size2.length, 0), matrix2._datatype);
      }
    }
    function _getSubmatrix(data, index2, dims, dim) {
      var last = dim === dims - 1;
      var range2 = index2.dimension(dim);
      if (last) {
        return range2.map(function(i3) {
          validateIndex(i3, data.length);
          return data[i3];
        }).valueOf();
      } else {
        return range2.map(function(i3) {
          validateIndex(i3, data.length);
          var child = data[i3];
          return _getSubmatrix(child, index2, dims, dim + 1);
        }).valueOf();
      }
    }
    function _set(matrix2, index2, submatrix, defaultValue) {
      if (!index2 || index2.isIndex !== true) {
        throw new TypeError("Invalid index");
      }
      var iSize = index2.size();
      var isScalar = index2.isScalar();
      var sSize;
      if (isMatrix(submatrix)) {
        sSize = submatrix.size();
        submatrix = submatrix.valueOf();
      } else {
        sSize = arraySize(submatrix);
      }
      if (isScalar) {
        if (sSize.length !== 0) {
          throw new TypeError("Scalar expected");
        }
        matrix2.set(index2.min(), submatrix, defaultValue);
      } else {
        if (!deepStrictEqual(sSize, iSize)) {
          try {
            if (sSize.length === 0) {
              submatrix = broadcastTo([submatrix], iSize);
            } else {
              submatrix = broadcastTo(submatrix, iSize);
            }
            sSize = arraySize(submatrix);
          } catch (_unused) {
          }
        }
        if (iSize.length < matrix2._size.length) {
          throw new DimensionError(iSize.length, matrix2._size.length, "<");
        }
        if (sSize.length < iSize.length) {
          var i3 = 0;
          var outer = 0;
          while (iSize[i3] === 1 && sSize[i3] === 1) {
            i3++;
          }
          while (iSize[i3] === 1) {
            outer++;
            i3++;
          }
          submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
        }
        if (!deepStrictEqual(iSize, sSize)) {
          throw new DimensionError(iSize, sSize, ">");
        }
        var size2 = index2.max().map(function(i4) {
          return i4 + 1;
        });
        _fit(matrix2, size2, defaultValue);
        var dims = iSize.length;
        var dim = 0;
        _setSubmatrix(matrix2._data, index2, submatrix, dims, dim);
      }
      return matrix2;
    }
    function _setSubmatrix(data, index2, submatrix, dims, dim) {
      var last = dim === dims - 1;
      var range2 = index2.dimension(dim);
      if (last) {
        range2.forEach(function(dataIndex, subIndex) {
          validateIndex(dataIndex);
          data[dataIndex] = submatrix[subIndex[0]];
        });
      } else {
        range2.forEach(function(dataIndex, subIndex) {
          validateIndex(dataIndex);
          _setSubmatrix(data[dataIndex], index2, submatrix[subIndex[0]], dims, dim + 1);
        });
      }
    }
    DenseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
      if (!isCollection(size2)) {
        throw new TypeError("Array or Matrix expected");
      }
      var sizeArray = size2.valueOf().map((value) => {
        return Array.isArray(value) && value.length === 1 ? value[0] : value;
      });
      var m = copy ? this.clone() : this;
      return _resize2(m, sizeArray, defaultValue);
    };
    function _resize2(matrix2, size2, defaultValue) {
      if (size2.length === 0) {
        var v = matrix2._data;
        while (isArray(v)) {
          v = v[0];
        }
        return v;
      }
      matrix2._size = size2.slice(0);
      matrix2._data = resize(matrix2._data, matrix2._size, defaultValue);
      return matrix2;
    }
    DenseMatrix2.prototype.reshape = function(size2, copy) {
      var m = copy ? this.clone() : this;
      m._data = reshape(m._data, size2);
      var currentLength = m._size.reduce((length, size3) => length * size3);
      m._size = processSizesWildcard(size2, currentLength);
      return m;
    };
    function _fit(matrix2, size2, defaultValue) {
      var newSize = matrix2._size.slice(0);
      var changed = false;
      while (newSize.length < size2.length) {
        newSize.push(0);
        changed = true;
      }
      for (var i3 = 0, ii = size2.length; i3 < ii; i3++) {
        if (size2[i3] > newSize[i3]) {
          newSize[i3] = size2[i3];
          changed = true;
        }
      }
      if (changed) {
        _resize2(matrix2, newSize, defaultValue);
      }
    }
    DenseMatrix2.prototype.clone = function() {
      var m = new DenseMatrix2({
        data: clone(this._data),
        size: clone(this._size),
        datatype: this._datatype
      });
      return m;
    };
    DenseMatrix2.prototype.size = function() {
      return this._size.slice(0);
    };
    DenseMatrix2.prototype.map = function(callback) {
      var me = this;
      var args = maxArgumentCount(callback);
      var recurse = function recurse2(value, index2) {
        if (isArray(value)) {
          return value.map(function(child, i3) {
            return recurse2(child, index2.concat(i3));
          });
        } else {
          if (args === 1) {
            return callback(value);
          } else if (args === 2) {
            return callback(value, index2);
          } else {
            return callback(value, index2, me);
          }
        }
      };
      var data = recurse(this._data, []);
      var datatype = this._datatype !== void 0 ? getArrayDataType(data, typeOf) : void 0;
      return new DenseMatrix2(data, datatype);
    };
    DenseMatrix2.prototype.forEach = function(callback) {
      var me = this;
      var recurse = function recurse2(value, index2) {
        if (isArray(value)) {
          value.forEach(function(child, i3) {
            recurse2(child, index2.concat(i3));
          });
        } else {
          callback(value, index2, me);
        }
      };
      recurse(this._data, []);
    };
    DenseMatrix2.prototype[Symbol.iterator] = function* () {
      var recurse = function* recurse2(value, index2) {
        if (isArray(value)) {
          for (var i3 = 0; i3 < value.length; i3++) {
            yield* recurse2(value[i3], index2.concat(i3));
          }
        } else {
          yield {
            value,
            index: index2
          };
        }
      };
      yield* recurse(this._data, []);
    };
    DenseMatrix2.prototype.rows = function() {
      var result = [];
      var s = this.size();
      if (s.length !== 2) {
        throw new TypeError("Rows can only be returned for a 2D matrix.");
      }
      var data = this._data;
      for (var row2 of data) {
        result.push(new DenseMatrix2([row2], this._datatype));
      }
      return result;
    };
    DenseMatrix2.prototype.columns = function() {
      var _this = this;
      var result = [];
      var s = this.size();
      if (s.length !== 2) {
        throw new TypeError("Rows can only be returned for a 2D matrix.");
      }
      var data = this._data;
      var _loop = function _loop2(i4) {
        var col = data.map((row2) => [row2[i4]]);
        result.push(new DenseMatrix2(col, _this._datatype));
      };
      for (var i3 = 0; i3 < s[1]; i3++) {
        _loop(i3);
      }
      return result;
    };
    DenseMatrix2.prototype.toArray = function() {
      return clone(this._data);
    };
    DenseMatrix2.prototype.valueOf = function() {
      return this._data;
    };
    DenseMatrix2.prototype.format = function(options) {
      return format3(this._data, options);
    };
    DenseMatrix2.prototype.toString = function() {
      return format3(this._data);
    };
    DenseMatrix2.prototype.toJSON = function() {
      return {
        mathjs: "DenseMatrix",
        data: this._data,
        size: this._size,
        datatype: this._datatype
      };
    };
    DenseMatrix2.prototype.diagonal = function(k) {
      if (k) {
        if (isBigNumber(k)) {
          k = k.toNumber();
        }
        if (!isNumber(k) || !isInteger(k)) {
          throw new TypeError("The parameter k must be an integer number");
        }
      } else {
        k = 0;
      }
      var kSuper = k > 0 ? k : 0;
      var kSub = k < 0 ? -k : 0;
      var rows = this._size[0];
      var columns = this._size[1];
      var n = Math.min(rows - kSub, columns - kSuper);
      var data = [];
      for (var i3 = 0; i3 < n; i3++) {
        data[i3] = this._data[i3 + kSub][i3 + kSuper];
      }
      return new DenseMatrix2({
        data,
        size: [n],
        datatype: this._datatype
      });
    };
    DenseMatrix2.diagonal = function(size2, value, k, defaultValue) {
      if (!isArray(size2)) {
        throw new TypeError("Array expected, size parameter");
      }
      if (size2.length !== 2) {
        throw new Error("Only two dimensions matrix are supported");
      }
      size2 = size2.map(function(s) {
        if (isBigNumber(s)) {
          s = s.toNumber();
        }
        if (!isNumber(s) || !isInteger(s) || s < 1) {
          throw new Error("Size values must be positive integers");
        }
        return s;
      });
      if (k) {
        if (isBigNumber(k)) {
          k = k.toNumber();
        }
        if (!isNumber(k) || !isInteger(k)) {
          throw new TypeError("The parameter k must be an integer number");
        }
      } else {
        k = 0;
      }
      var kSuper = k > 0 ? k : 0;
      var kSub = k < 0 ? -k : 0;
      var rows = size2[0];
      var columns = size2[1];
      var n = Math.min(rows - kSub, columns - kSuper);
      var _value;
      if (isArray(value)) {
        if (value.length !== n) {
          throw new Error("Invalid value array length");
        }
        _value = function _value2(i3) {
          return value[i3];
        };
      } else if (isMatrix(value)) {
        var ms = value.size();
        if (ms.length !== 1 || ms[0] !== n) {
          throw new Error("Invalid matrix length");
        }
        _value = function _value2(i3) {
          return value.get([i3]);
        };
      } else {
        _value = function _value2() {
          return value;
        };
      }
      if (!defaultValue) {
        defaultValue = isBigNumber(_value(0)) ? _value(0).mul(0) : 0;
      }
      var data = [];
      if (size2.length > 0) {
        data = resize(data, size2, defaultValue);
        for (var d = 0; d < n; d++) {
          data[d + kSub][d + kSuper] = _value(d);
        }
      }
      return new DenseMatrix2({
        data,
        size: [rows, columns]
      });
    };
    DenseMatrix2.fromJSON = function(json) {
      return new DenseMatrix2(json);
    };
    DenseMatrix2.prototype.swapRows = function(i3, j) {
      if (!isNumber(i3) || !isInteger(i3) || !isNumber(j) || !isInteger(j)) {
        throw new Error("Row index must be positive integers");
      }
      if (this._size.length !== 2) {
        throw new Error("Only two dimensional matrix is supported");
      }
      validateIndex(i3, this._size[0]);
      validateIndex(j, this._size[0]);
      DenseMatrix2._swapRows(i3, j, this._data);
      return this;
    };
    DenseMatrix2._swapRows = function(i3, j, data) {
      var vi = data[i3];
      data[i3] = data[j];
      data[j] = vi;
    };
    function preprocess(data) {
      if (isMatrix(data)) {
        return preprocess(data.valueOf());
      }
      if (isArray(data)) {
        return data.map(preprocess);
      }
      return data;
    }
    return DenseMatrix2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/function/utils/clone.js
  var name8 = "clone";
  var dependencies9 = ["typed"];
  var createClone = /* @__PURE__ */ factory(name8, dependencies9, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name8, {
      any: clone
    });
  });

  // node_modules/mathjs/lib/esm/utils/switch.js
  function _switch(mat) {
    var I2 = mat.length;
    var J = mat[0].length;
    var i3, j;
    var ret = [];
    for (j = 0; j < J; j++) {
      var tmp = [];
      for (i3 = 0; i3 < I2; i3++) {
        tmp.push(mat[i3][j]);
      }
      ret.push(tmp);
    }
    return ret;
  }

  // node_modules/mathjs/lib/esm/utils/collection.js
  function containsCollections(array) {
    for (var i3 = 0; i3 < array.length; i3++) {
      if (isCollection(array[i3])) {
        return true;
      }
    }
    return false;
  }
  function deepForEach(array, callback) {
    if (isMatrix(array)) {
      array = array.valueOf();
    }
    for (var i3 = 0, ii = array.length; i3 < ii; i3++) {
      var value = array[i3];
      if (Array.isArray(value)) {
        deepForEach(value, callback);
      } else {
        callback(value);
      }
    }
  }
  function deepMap(array, callback, skipZeros) {
    if (array && typeof array.map === "function") {
      return array.map(function(x) {
        return deepMap(x, callback, skipZeros);
      });
    } else {
      return callback(array);
    }
  }
  function reduce(mat, dim, callback) {
    var size2 = Array.isArray(mat) ? arraySize(mat) : mat.size();
    if (dim < 0 || dim >= size2.length) {
      throw new IndexError(dim, size2.length);
    }
    if (isMatrix(mat)) {
      return mat.create(_reduce(mat.valueOf(), dim, callback));
    } else {
      return _reduce(mat, dim, callback);
    }
  }
  function _reduce(mat, dim, callback) {
    var i3, ret, val, tran;
    if (dim <= 0) {
      if (!Array.isArray(mat[0])) {
        val = mat[0];
        for (i3 = 1; i3 < mat.length; i3++) {
          val = callback(val, mat[i3]);
        }
        return val;
      } else {
        tran = _switch(mat);
        ret = [];
        for (i3 = 0; i3 < tran.length; i3++) {
          ret[i3] = _reduce(tran[i3], dim - 1, callback);
        }
        return ret;
      }
    } else {
      ret = [];
      for (i3 = 0; i3 < mat.length; i3++) {
        ret[i3] = _reduce(mat[i3], dim - 1, callback);
      }
      return ret;
    }
  }
  function scatter(a, j, w2, x, u, mark, cindex, f, inverse, update, value) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var k, k0, k1, i3;
    if (x) {
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        i3 = aindex[k];
        if (w2[i3] !== mark) {
          w2[i3] = mark;
          cindex.push(i3);
          if (update) {
            x[i3] = inverse ? f(avalues[k], value) : f(value, avalues[k]);
            u[i3] = mark;
          } else {
            x[i3] = avalues[k];
          }
        } else {
          x[i3] = inverse ? f(avalues[k], x[i3]) : f(x[i3], avalues[k]);
          u[i3] = mark;
        }
      }
    } else {
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        i3 = aindex[k];
        if (w2[i3] !== mark) {
          w2[i3] = mark;
          cindex.push(i3);
        } else {
          u[i3] = mark;
        }
      }
    }
  }

  // node_modules/mathjs/lib/esm/function/utils/isInteger.js
  var name9 = "isInteger";
  var dependencies10 = ["typed"];
  var createIsInteger = /* @__PURE__ */ factory(name9, dependencies10, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name9, {
      number: isInteger,
      // TODO: what to do with isInteger(add(0.1, 0.2))  ?
      BigNumber: function BigNumber2(x) {
        return x.isInt();
      },
      Fraction: function Fraction3(x) {
        return x.d === 1 && isFinite(x.n);
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/plain/number/arithmetic.js
  var n1 = "number";
  var n2 = "number, number";
  function absNumber(a) {
    return Math.abs(a);
  }
  absNumber.signature = n1;
  function addNumber(a, b) {
    return a + b;
  }
  addNumber.signature = n2;
  function subtractNumber(a, b) {
    return a - b;
  }
  subtractNumber.signature = n2;
  function multiplyNumber(a, b) {
    return a * b;
  }
  multiplyNumber.signature = n2;
  function divideNumber(a, b) {
    return a / b;
  }
  divideNumber.signature = n2;
  function unaryMinusNumber(x) {
    return -x;
  }
  unaryMinusNumber.signature = n1;
  function unaryPlusNumber(x) {
    return x;
  }
  unaryPlusNumber.signature = n1;
  function cbrtNumber(x) {
    return cbrt(x);
  }
  cbrtNumber.signature = n1;
  function cubeNumber(x) {
    return x * x * x;
  }
  cubeNumber.signature = n1;
  function expNumber(x) {
    return Math.exp(x);
  }
  expNumber.signature = n1;
  function expm1Number(x) {
    return expm1(x);
  }
  expm1Number.signature = n1;
  function gcdNumber(a, b) {
    if (!isInteger(a) || !isInteger(b)) {
      throw new Error("Parameters in function gcd must be integer numbers");
    }
    var r;
    while (b !== 0) {
      r = a % b;
      a = b;
      b = r;
    }
    return a < 0 ? -a : a;
  }
  gcdNumber.signature = n2;
  function lcmNumber(a, b) {
    if (!isInteger(a) || !isInteger(b)) {
      throw new Error("Parameters in function lcm must be integer numbers");
    }
    if (a === 0 || b === 0) {
      return 0;
    }
    var t;
    var prod2 = a * b;
    while (b !== 0) {
      t = b;
      b = a % t;
      a = t;
    }
    return Math.abs(prod2 / a);
  }
  lcmNumber.signature = n2;
  function logNumber(x, y2) {
    if (y2) {
      return Math.log(x) / Math.log(y2);
    }
    return Math.log(x);
  }
  function log10Number(x) {
    return log10(x);
  }
  log10Number.signature = n1;
  function log2Number(x) {
    return log2(x);
  }
  log2Number.signature = n1;
  function log1pNumber(x) {
    return log1p(x);
  }
  log1pNumber.signature = n1;
  function modNumber(x, y2) {
    return y2 === 0 ? x : x - y2 * Math.floor(x / y2);
  }
  modNumber.signature = n2;
  function nthRootNumber(a) {
    var root = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    var inv2 = root < 0;
    if (inv2) {
      root = -root;
    }
    if (root === 0) {
      throw new Error("Root must be non-zero");
    }
    if (a < 0 && Math.abs(root) % 2 !== 1) {
      throw new Error("Root must be odd when a is negative.");
    }
    if (a === 0) {
      return inv2 ? Infinity : 0;
    }
    if (!isFinite(a)) {
      return inv2 ? 0 : a;
    }
    var x = Math.pow(Math.abs(a), 1 / root);
    x = a < 0 ? -x : x;
    return inv2 ? 1 / x : x;
  }
  function signNumber(x) {
    return sign(x);
  }
  signNumber.signature = n1;
  function sqrtNumber(x) {
    return Math.sqrt(x);
  }
  sqrtNumber.signature = n1;
  function squareNumber(x) {
    return x * x;
  }
  squareNumber.signature = n1;
  function xgcdNumber(a, b) {
    var t;
    var q;
    var r;
    var x = 0;
    var lastx = 1;
    var y2 = 1;
    var lasty = 0;
    if (!isInteger(a) || !isInteger(b)) {
      throw new Error("Parameters in function xgcd must be integer numbers");
    }
    while (b) {
      q = Math.floor(a / b);
      r = a - q * b;
      t = x;
      x = lastx - q * x;
      lastx = t;
      t = y2;
      y2 = lasty - q * y2;
      lasty = t;
      a = b;
      b = r;
    }
    var res;
    if (a < 0) {
      res = [-a, -lastx, -lasty];
    } else {
      res = [a, a ? lastx : 0, lasty];
    }
    return res;
  }
  xgcdNumber.signature = n2;
  function powNumber(x, y2) {
    if (x * x < 1 && y2 === Infinity || x * x > 1 && y2 === -Infinity) {
      return 0;
    }
    return Math.pow(x, y2);
  }
  powNumber.signature = n2;
  function roundNumber(value) {
    var decimals = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (!isInteger(decimals) || decimals < 0 || decimals > 15) {
      throw new Error("Number of decimals in function round must be an integer from 0 to 15 inclusive");
    }
    return parseFloat(toFixed(value, decimals));
  }
  function normNumber(x) {
    return Math.abs(x);
  }
  normNumber.signature = n1;

  // node_modules/mathjs/lib/esm/plain/number/bitwise.js
  var n12 = "number";
  var n22 = "number, number";
  function bitAndNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function bitAnd");
    }
    return x & y2;
  }
  bitAndNumber.signature = n22;
  function bitNotNumber(x) {
    if (!isInteger(x)) {
      throw new Error("Integer expected in function bitNot");
    }
    return ~x;
  }
  bitNotNumber.signature = n12;
  function bitOrNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function bitOr");
    }
    return x | y2;
  }
  bitOrNumber.signature = n22;
  function bitXorNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function bitXor");
    }
    return x ^ y2;
  }
  bitXorNumber.signature = n22;
  function leftShiftNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function leftShift");
    }
    return x << y2;
  }
  leftShiftNumber.signature = n22;
  function rightArithShiftNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function rightArithShift");
    }
    return x >> y2;
  }
  rightArithShiftNumber.signature = n22;
  function rightLogShiftNumber(x, y2) {
    if (!isInteger(x) || !isInteger(y2)) {
      throw new Error("Integers expected in function rightLogShift");
    }
    return x >>> y2;
  }
  rightLogShiftNumber.signature = n22;

  // node_modules/mathjs/lib/esm/utils/product.js
  function product2(i3, n) {
    if (n < i3) {
      return 1;
    }
    if (n === i3) {
      return n;
    }
    var half = n + i3 >> 1;
    return product2(i3, half) * product2(half + 1, n);
  }

  // node_modules/mathjs/lib/esm/plain/number/combinations.js
  function combinationsNumber(n, k) {
    if (!isInteger(n) || n < 0) {
      throw new TypeError("Positive integer value expected in function combinations");
    }
    if (!isInteger(k) || k < 0) {
      throw new TypeError("Positive integer value expected in function combinations");
    }
    if (k > n) {
      throw new TypeError("k must be less than or equal to n");
    }
    var nMinusk = n - k;
    var answer = 1;
    var firstnumerator = k < nMinusk ? nMinusk + 1 : k + 1;
    var nextdivisor = 2;
    var lastdivisor = k < nMinusk ? k : nMinusk;
    for (var nextnumerator = firstnumerator; nextnumerator <= n; ++nextnumerator) {
      answer *= nextnumerator;
      while (nextdivisor <= lastdivisor && answer % nextdivisor === 0) {
        answer /= nextdivisor;
        ++nextdivisor;
      }
    }
    if (nextdivisor <= lastdivisor) {
      answer /= product2(nextdivisor, lastdivisor);
    }
    return answer;
  }
  combinationsNumber.signature = "number, number";

  // node_modules/mathjs/lib/esm/plain/number/constants.js
  var pi = Math.PI;
  var tau = 2 * Math.PI;
  var e = Math.E;
  var phi = 1.618033988749895;

  // node_modules/mathjs/lib/esm/plain/number/logical.js
  var n13 = "number";
  var n23 = "number, number";
  function notNumber(x) {
    return !x;
  }
  notNumber.signature = n13;
  function orNumber(x, y2) {
    return !!(x || y2);
  }
  orNumber.signature = n23;
  function xorNumber(x, y2) {
    return !!x !== !!y2;
  }
  xorNumber.signature = n23;
  function andNumber(x, y2) {
    return !!(x && y2);
  }
  andNumber.signature = n23;

  // node_modules/mathjs/lib/esm/plain/number/probability.js
  function gammaNumber(n) {
    var x;
    if (isInteger(n)) {
      if (n <= 0) {
        return isFinite(n) ? Infinity : NaN;
      }
      if (n > 171) {
        return Infinity;
      }
      return product2(1, n - 1);
    }
    if (n < 0.5) {
      return Math.PI / (Math.sin(Math.PI * n) * gammaNumber(1 - n));
    }
    if (n >= 171.35) {
      return Infinity;
    }
    if (n > 85) {
      var twoN = n * n;
      var threeN = twoN * n;
      var fourN = threeN * n;
      var fiveN = fourN * n;
      return Math.sqrt(2 * Math.PI / n) * Math.pow(n / Math.E, n) * (1 + 1 / (12 * n) + 1 / (288 * twoN) - 139 / (51840 * threeN) - 571 / (2488320 * fourN) + 163879 / (209018880 * fiveN) + 5246819 / (75246796800 * fiveN * n));
    }
    --n;
    x = gammaP[0];
    for (var i3 = 1; i3 < gammaP.length; ++i3) {
      x += gammaP[i3] / (n + i3);
    }
    var t = n + gammaG + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
  }
  gammaNumber.signature = "number";
  var gammaG = 4.7421875;
  var gammaP = [0.9999999999999971, 57.15623566586292, -59.59796035547549, 14.136097974741746, -0.4919138160976202, 3399464998481189e-20, 4652362892704858e-20, -9837447530487956e-20, 1580887032249125e-19, -21026444172410488e-20, 21743961811521265e-20, -1643181065367639e-19, 8441822398385275e-20, -26190838401581408e-21, 36899182659531625e-22];
  var lnSqrt2PI = 0.9189385332046728;
  var lgammaG = 5;
  var lgammaN = 7;
  var lgammaSeries = [1.000000000190015, 76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  function lgammaNumber(n) {
    if (n < 0)
      return NaN;
    if (n === 0)
      return Infinity;
    if (!isFinite(n))
      return n;
    if (n < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * n)) - lgammaNumber(1 - n);
    }
    n = n - 1;
    var base = n + lgammaG + 0.5;
    var sum3 = lgammaSeries[0];
    for (var i3 = lgammaN - 1; i3 >= 1; i3--) {
      sum3 += lgammaSeries[i3] / (n + i3);
    }
    return lnSqrt2PI + (n + 0.5) * Math.log(base) - base + Math.log(sum3);
  }
  lgammaNumber.signature = "number";

  // node_modules/mathjs/lib/esm/plain/number/trigonometry.js
  var n14 = "number";
  var n24 = "number, number";
  function acosNumber(x) {
    return Math.acos(x);
  }
  acosNumber.signature = n14;
  function acoshNumber(x) {
    return acosh(x);
  }
  acoshNumber.signature = n14;
  function acotNumber(x) {
    return Math.atan(1 / x);
  }
  acotNumber.signature = n14;
  function acothNumber(x) {
    return isFinite(x) ? (Math.log((x + 1) / x) + Math.log(x / (x - 1))) / 2 : 0;
  }
  acothNumber.signature = n14;
  function acscNumber(x) {
    return Math.asin(1 / x);
  }
  acscNumber.signature = n14;
  function acschNumber(x) {
    var xInv = 1 / x;
    return Math.log(xInv + Math.sqrt(xInv * xInv + 1));
  }
  acschNumber.signature = n14;
  function asecNumber(x) {
    return Math.acos(1 / x);
  }
  asecNumber.signature = n14;
  function asechNumber(x) {
    var xInv = 1 / x;
    var ret = Math.sqrt(xInv * xInv - 1);
    return Math.log(ret + xInv);
  }
  asechNumber.signature = n14;
  function asinNumber(x) {
    return Math.asin(x);
  }
  asinNumber.signature = n14;
  function asinhNumber(x) {
    return asinh(x);
  }
  asinhNumber.signature = n14;
  function atanNumber(x) {
    return Math.atan(x);
  }
  atanNumber.signature = n14;
  function atan2Number(y2, x) {
    return Math.atan2(y2, x);
  }
  atan2Number.signature = n24;
  function atanhNumber(x) {
    return atanh(x);
  }
  atanhNumber.signature = n14;
  function cosNumber(x) {
    return Math.cos(x);
  }
  cosNumber.signature = n14;
  function coshNumber(x) {
    return cosh(x);
  }
  coshNumber.signature = n14;
  function cotNumber(x) {
    return 1 / Math.tan(x);
  }
  cotNumber.signature = n14;
  function cothNumber(x) {
    var e3 = Math.exp(2 * x);
    return (e3 + 1) / (e3 - 1);
  }
  cothNumber.signature = n14;
  function cscNumber(x) {
    return 1 / Math.sin(x);
  }
  cscNumber.signature = n14;
  function cschNumber(x) {
    if (x === 0) {
      return Number.POSITIVE_INFINITY;
    } else {
      return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * sign(x);
    }
  }
  cschNumber.signature = n14;
  function secNumber(x) {
    return 1 / Math.cos(x);
  }
  secNumber.signature = n14;
  function sechNumber(x) {
    return 2 / (Math.exp(x) + Math.exp(-x));
  }
  sechNumber.signature = n14;
  function sinNumber(x) {
    return Math.sin(x);
  }
  sinNumber.signature = n14;
  function sinhNumber(x) {
    return sinh(x);
  }
  sinhNumber.signature = n14;
  function tanNumber(x) {
    return Math.tan(x);
  }
  tanNumber.signature = n14;
  function tanhNumber(x) {
    return tanh(x);
  }
  tanhNumber.signature = n14;

  // node_modules/mathjs/lib/esm/plain/number/utils.js
  var n15 = "number";
  function isIntegerNumber(x) {
    return isInteger(x);
  }
  isIntegerNumber.signature = n15;
  function isNegativeNumber(x) {
    return x < 0;
  }
  isNegativeNumber.signature = n15;
  function isPositiveNumber(x) {
    return x > 0;
  }
  isPositiveNumber.signature = n15;
  function isZeroNumber(x) {
    return x === 0;
  }
  isZeroNumber.signature = n15;
  function isNaNNumber(x) {
    return Number.isNaN(x);
  }
  isNaNNumber.signature = n15;

  // node_modules/mathjs/lib/esm/function/utils/isNegative.js
  var name10 = "isNegative";
  var dependencies11 = ["typed"];
  var createIsNegative = /* @__PURE__ */ factory(name10, dependencies11, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name10, {
      number: isNegativeNumber,
      BigNumber: function BigNumber2(x) {
        return x.isNeg() && !x.isZero() && !x.isNaN();
      },
      Fraction: function Fraction3(x) {
        return x.s < 0;
      },
      Unit: typed3.referToSelf((self2) => (x) => typed3.find(self2, x.valueType())(x.value)),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/isNumeric.js
  var name11 = "isNumeric";
  var dependencies12 = ["typed"];
  var createIsNumeric = /* @__PURE__ */ factory(name11, dependencies12, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name11, {
      "number | BigNumber | Fraction | boolean": () => true,
      "Complex | Unit | string | null | undefined | Node": () => false,
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/hasNumericValue.js
  var name12 = "hasNumericValue";
  var dependencies13 = ["typed", "isNumeric"];
  var createHasNumericValue = /* @__PURE__ */ factory(name12, dependencies13, (_ref) => {
    var {
      typed: typed3,
      isNumeric: isNumeric2
    } = _ref;
    return typed3(name12, {
      boolean: () => true,
      string: function string2(x) {
        return x.trim().length > 0 && !isNaN(Number(x));
      },
      any: function any(x) {
        return isNumeric2(x);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/isPositive.js
  var name13 = "isPositive";
  var dependencies14 = ["typed"];
  var createIsPositive = /* @__PURE__ */ factory(name13, dependencies14, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name13, {
      number: isPositiveNumber,
      BigNumber: function BigNumber2(x) {
        return !x.isNeg() && !x.isZero() && !x.isNaN();
      },
      Fraction: function Fraction3(x) {
        return x.s > 0 && x.n > 0;
      },
      Unit: typed3.referToSelf((self2) => (x) => typed3.find(self2, x.valueType())(x.value)),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/isZero.js
  var name14 = "isZero";
  var dependencies15 = ["typed"];
  var createIsZero = /* @__PURE__ */ factory(name14, dependencies15, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name14, {
      number: isZeroNumber,
      BigNumber: function BigNumber2(x) {
        return x.isZero();
      },
      Complex: function Complex3(x) {
        return x.re === 0 && x.im === 0;
      },
      Fraction: function Fraction3(x) {
        return x.d === 1 && x.n === 0;
      },
      Unit: typed3.referToSelf((self2) => (x) => typed3.find(self2, x.valueType())(x.value)),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/isNaN.js
  var name15 = "isNaN";
  var dependencies16 = ["typed"];
  var createIsNaN = /* @__PURE__ */ factory(name15, dependencies16, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name15, {
      number: isNaNNumber,
      BigNumber: function BigNumber2(x) {
        return x.isNaN();
      },
      Fraction: function Fraction3(x) {
        return false;
      },
      Complex: function Complex3(x) {
        return x.isNaN();
      },
      Unit: function Unit2(x) {
        return Number.isNaN(x.value);
      },
      "Array | Matrix": function ArrayMatrix(x) {
        return deepMap(x, Number.isNaN);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/typeOf.js
  var name16 = "typeOf";
  var dependencies17 = ["typed"];
  var createTypeOf = /* @__PURE__ */ factory(name16, dependencies17, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name16, {
      any: typeOf
    });
  });

  // node_modules/mathjs/lib/esm/utils/bignumber/nearlyEqual.js
  function nearlyEqual2(x, y2, epsilon) {
    if (epsilon === null || epsilon === void 0) {
      return x.eq(y2);
    }
    if (x.eq(y2)) {
      return true;
    }
    if (x.isNaN() || y2.isNaN()) {
      return false;
    }
    if (x.isFinite() && y2.isFinite()) {
      var diff2 = x.minus(y2).abs();
      if (diff2.isZero()) {
        return true;
      } else {
        var max3 = x.constructor.max(x.abs(), y2.abs());
        return diff2.lte(max3.times(epsilon));
      }
    }
    return false;
  }

  // node_modules/mathjs/lib/esm/utils/complex.js
  function complexEquals(x, y2, epsilon) {
    return nearlyEqual(x.re, y2.re, epsilon) && nearlyEqual(x.im, y2.im, epsilon);
  }

  // node_modules/mathjs/lib/esm/function/relational/compareUnits.js
  var createCompareUnits = /* @__PURE__ */ factory("compareUnits", ["typed"], (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return {
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => {
        if (!x.equalBase(y2)) {
          throw new Error("Cannot compare units with different base");
        }
        return typed3.find(self2, [x.valueType(), y2.valueType()])(x.value, y2.value);
      })
    };
  });

  // node_modules/mathjs/lib/esm/function/relational/equalScalar.js
  var name17 = "equalScalar";
  var dependencies18 = ["typed", "config"];
  var createEqualScalar = /* @__PURE__ */ factory(name17, dependencies18, (_ref) => {
    var {
      typed: typed3,
      config: config4
    } = _ref;
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name17, {
      "boolean, boolean": function booleanBoolean(x, y2) {
        return x === y2;
      },
      "number, number": function numberNumber(x, y2) {
        return nearlyEqual(x, y2, config4.epsilon);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.eq(y2) || nearlyEqual2(x, y2, config4.epsilon);
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return x.equals(y2);
      },
      "Complex, Complex": function ComplexComplex(x, y2) {
        return complexEquals(x, y2, config4.epsilon);
      }
    }, compareUnits);
  });
  var createEqualScalarNumber = factory(name17, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name17, {
      "number, number": function numberNumber(x, y2) {
        return nearlyEqual(x, y2, config4.epsilon);
      }
    });
  });

  // node_modules/mathjs/lib/esm/type/matrix/SparseMatrix.js
  var name18 = "SparseMatrix";
  var dependencies19 = ["typed", "equalScalar", "Matrix"];
  var createSparseMatrixClass = /* @__PURE__ */ factory(name18, dependencies19, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2,
      Matrix: Matrix2
    } = _ref;
    function SparseMatrix2(data, datatype) {
      if (!(this instanceof SparseMatrix2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      if (datatype && !isString(datatype)) {
        throw new Error("Invalid datatype: " + datatype);
      }
      if (isMatrix(data)) {
        _createFromMatrix(this, data, datatype);
      } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
        this._values = data.values;
        this._index = data.index;
        this._ptr = data.ptr;
        this._size = data.size;
        this._datatype = datatype || data.datatype;
      } else if (isArray(data)) {
        _createFromArray(this, data, datatype);
      } else if (data) {
        throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
      } else {
        this._values = [];
        this._index = [];
        this._ptr = [0];
        this._size = [0, 0];
        this._datatype = datatype;
      }
    }
    function _createFromMatrix(matrix2, source, datatype) {
      if (source.type === "SparseMatrix") {
        matrix2._values = source._values ? clone(source._values) : void 0;
        matrix2._index = clone(source._index);
        matrix2._ptr = clone(source._ptr);
        matrix2._size = clone(source._size);
        matrix2._datatype = datatype || source._datatype;
      } else {
        _createFromArray(matrix2, source.valueOf(), datatype || source._datatype);
      }
    }
    function _createFromArray(matrix2, data, datatype) {
      matrix2._values = [];
      matrix2._index = [];
      matrix2._ptr = [];
      matrix2._datatype = datatype;
      var rows = data.length;
      var columns = 0;
      var eq = equalScalar2;
      var zero = 0;
      if (isString(datatype)) {
        eq = typed3.find(equalScalar2, [datatype, datatype]) || equalScalar2;
        zero = typed3.convert(0, datatype);
      }
      if (rows > 0) {
        var j = 0;
        do {
          matrix2._ptr.push(matrix2._index.length);
          for (var i3 = 0; i3 < rows; i3++) {
            var row2 = data[i3];
            if (isArray(row2)) {
              if (j === 0 && columns < row2.length) {
                columns = row2.length;
              }
              if (j < row2.length) {
                var v = row2[j];
                if (!eq(v, zero)) {
                  matrix2._values.push(v);
                  matrix2._index.push(i3);
                }
              }
            } else {
              if (j === 0 && columns < 1) {
                columns = 1;
              }
              if (!eq(row2, zero)) {
                matrix2._values.push(row2);
                matrix2._index.push(i3);
              }
            }
          }
          j++;
        } while (j < columns);
      }
      matrix2._ptr.push(matrix2._index.length);
      matrix2._size = [rows, columns];
    }
    SparseMatrix2.prototype = new Matrix2();
    SparseMatrix2.prototype.createSparseMatrix = function(data, datatype) {
      return new SparseMatrix2(data, datatype);
    };
    Object.defineProperty(SparseMatrix2, "name", {
      value: "SparseMatrix"
    });
    SparseMatrix2.prototype.constructor = SparseMatrix2;
    SparseMatrix2.prototype.type = "SparseMatrix";
    SparseMatrix2.prototype.isSparseMatrix = true;
    SparseMatrix2.prototype.getDataType = function() {
      return getArrayDataType(this._values, typeOf);
    };
    SparseMatrix2.prototype.storage = function() {
      return "sparse";
    };
    SparseMatrix2.prototype.datatype = function() {
      return this._datatype;
    };
    SparseMatrix2.prototype.create = function(data, datatype) {
      return new SparseMatrix2(data, datatype);
    };
    SparseMatrix2.prototype.density = function() {
      var rows = this._size[0];
      var columns = this._size[1];
      return rows !== 0 && columns !== 0 ? this._index.length / (rows * columns) : 0;
    };
    SparseMatrix2.prototype.subset = function(index2, replacement, defaultValue) {
      if (!this._values) {
        throw new Error("Cannot invoke subset on a Pattern only matrix");
      }
      switch (arguments.length) {
        case 1:
          return _getsubset(this, index2);
        case 2:
        case 3:
          return _setsubset(this, index2, replacement, defaultValue);
        default:
          throw new SyntaxError("Wrong number of arguments");
      }
    };
    function _getsubset(matrix2, idx) {
      if (!isIndex(idx)) {
        throw new TypeError("Invalid index");
      }
      var isScalar = idx.isScalar();
      if (isScalar) {
        return matrix2.get(idx.min());
      }
      var size2 = idx.size();
      if (size2.length !== matrix2._size.length) {
        throw new DimensionError(size2.length, matrix2._size.length);
      }
      var i3, ii, k, kk;
      var min3 = idx.min();
      var max3 = idx.max();
      for (i3 = 0, ii = matrix2._size.length; i3 < ii; i3++) {
        validateIndex(min3[i3], matrix2._size[i3]);
        validateIndex(max3[i3], matrix2._size[i3]);
      }
      var mvalues = matrix2._values;
      var mindex = matrix2._index;
      var mptr = matrix2._ptr;
      var rows = idx.dimension(0);
      var columns = idx.dimension(1);
      var w2 = [];
      var pv = [];
      rows.forEach(function(i4, r) {
        pv[i4] = r[0];
        w2[i4] = true;
      });
      var values = mvalues ? [] : void 0;
      var index2 = [];
      var ptr = [];
      columns.forEach(function(j) {
        ptr.push(index2.length);
        for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
          i3 = mindex[k];
          if (w2[i3] === true) {
            index2.push(pv[i3]);
            if (values) {
              values.push(mvalues[k]);
            }
          }
        }
      });
      ptr.push(index2.length);
      return new SparseMatrix2({
        values,
        index: index2,
        ptr,
        size: size2,
        datatype: matrix2._datatype
      });
    }
    function _setsubset(matrix2, index2, submatrix, defaultValue) {
      if (!index2 || index2.isIndex !== true) {
        throw new TypeError("Invalid index");
      }
      var iSize = index2.size();
      var isScalar = index2.isScalar();
      var sSize;
      if (isMatrix(submatrix)) {
        sSize = submatrix.size();
        submatrix = submatrix.toArray();
      } else {
        sSize = arraySize(submatrix);
      }
      if (isScalar) {
        if (sSize.length !== 0) {
          throw new TypeError("Scalar expected");
        }
        matrix2.set(index2.min(), submatrix, defaultValue);
      } else {
        if (iSize.length !== 1 && iSize.length !== 2) {
          throw new DimensionError(iSize.length, matrix2._size.length, "<");
        }
        if (sSize.length < iSize.length) {
          var i3 = 0;
          var outer = 0;
          while (iSize[i3] === 1 && sSize[i3] === 1) {
            i3++;
          }
          while (iSize[i3] === 1) {
            outer++;
            i3++;
          }
          submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
        }
        if (!deepStrictEqual(iSize, sSize)) {
          throw new DimensionError(iSize, sSize, ">");
        }
        if (iSize.length === 1) {
          var range2 = index2.dimension(0);
          range2.forEach(function(dataIndex, subIndex) {
            validateIndex(dataIndex);
            matrix2.set([dataIndex, 0], submatrix[subIndex[0]], defaultValue);
          });
        } else {
          var firstDimensionRange = index2.dimension(0);
          var secondDimensionRange = index2.dimension(1);
          firstDimensionRange.forEach(function(firstDataIndex, firstSubIndex) {
            validateIndex(firstDataIndex);
            secondDimensionRange.forEach(function(secondDataIndex, secondSubIndex) {
              validateIndex(secondDataIndex);
              matrix2.set([firstDataIndex, secondDataIndex], submatrix[firstSubIndex[0]][secondSubIndex[0]], defaultValue);
            });
          });
        }
      }
      return matrix2;
    }
    SparseMatrix2.prototype.get = function(index2) {
      if (!isArray(index2)) {
        throw new TypeError("Array expected");
      }
      if (index2.length !== this._size.length) {
        throw new DimensionError(index2.length, this._size.length);
      }
      if (!this._values) {
        throw new Error("Cannot invoke get on a Pattern only matrix");
      }
      var i3 = index2[0];
      var j = index2[1];
      validateIndex(i3, this._size[0]);
      validateIndex(j, this._size[1]);
      var k = _getValueIndex(i3, this._ptr[j], this._ptr[j + 1], this._index);
      if (k < this._ptr[j + 1] && this._index[k] === i3) {
        return this._values[k];
      }
      return 0;
    };
    SparseMatrix2.prototype.set = function(index2, v, defaultValue) {
      if (!isArray(index2)) {
        throw new TypeError("Array expected");
      }
      if (index2.length !== this._size.length) {
        throw new DimensionError(index2.length, this._size.length);
      }
      if (!this._values) {
        throw new Error("Cannot invoke set on a Pattern only matrix");
      }
      var i3 = index2[0];
      var j = index2[1];
      var rows = this._size[0];
      var columns = this._size[1];
      var eq = equalScalar2;
      var zero = 0;
      if (isString(this._datatype)) {
        eq = typed3.find(equalScalar2, [this._datatype, this._datatype]) || equalScalar2;
        zero = typed3.convert(0, this._datatype);
      }
      if (i3 > rows - 1 || j > columns - 1) {
        _resize2(this, Math.max(i3 + 1, rows), Math.max(j + 1, columns), defaultValue);
        rows = this._size[0];
        columns = this._size[1];
      }
      validateIndex(i3, rows);
      validateIndex(j, columns);
      var k = _getValueIndex(i3, this._ptr[j], this._ptr[j + 1], this._index);
      if (k < this._ptr[j + 1] && this._index[k] === i3) {
        if (!eq(v, zero)) {
          this._values[k] = v;
        } else {
          _remove(k, j, this._values, this._index, this._ptr);
        }
      } else {
        if (!eq(v, zero)) {
          _insert(k, i3, j, v, this._values, this._index, this._ptr);
        }
      }
      return this;
    };
    function _getValueIndex(i3, top, bottom, index2) {
      if (bottom - top === 0) {
        return bottom;
      }
      for (var r = top; r < bottom; r++) {
        if (index2[r] === i3) {
          return r;
        }
      }
      return top;
    }
    function _remove(k, j, values, index2, ptr) {
      values.splice(k, 1);
      index2.splice(k, 1);
      for (var x = j + 1; x < ptr.length; x++) {
        ptr[x]--;
      }
    }
    function _insert(k, i3, j, v, values, index2, ptr) {
      values.splice(k, 0, v);
      index2.splice(k, 0, i3);
      for (var x = j + 1; x < ptr.length; x++) {
        ptr[x]++;
      }
    }
    SparseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
      if (!isCollection(size2)) {
        throw new TypeError("Array or Matrix expected");
      }
      var sizeArray = size2.valueOf().map((value) => {
        return Array.isArray(value) && value.length === 1 ? value[0] : value;
      });
      if (sizeArray.length !== 2) {
        throw new Error("Only two dimensions matrix are supported");
      }
      sizeArray.forEach(function(value) {
        if (!isNumber(value) || !isInteger(value) || value < 0) {
          throw new TypeError("Invalid size, must contain positive integers (size: " + format3(sizeArray) + ")");
        }
      });
      var m = copy ? this.clone() : this;
      return _resize2(m, sizeArray[0], sizeArray[1], defaultValue);
    };
    function _resize2(matrix2, rows, columns, defaultValue) {
      var value = defaultValue || 0;
      var eq = equalScalar2;
      var zero = 0;
      if (isString(matrix2._datatype)) {
        eq = typed3.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
        zero = typed3.convert(0, matrix2._datatype);
        value = typed3.convert(value, matrix2._datatype);
      }
      var ins = !eq(value, zero);
      var r = matrix2._size[0];
      var c = matrix2._size[1];
      var i3, j, k;
      if (columns > c) {
        for (j = c; j < columns; j++) {
          matrix2._ptr[j] = matrix2._values.length;
          if (ins) {
            for (i3 = 0; i3 < r; i3++) {
              matrix2._values.push(value);
              matrix2._index.push(i3);
            }
          }
        }
        matrix2._ptr[columns] = matrix2._values.length;
      } else if (columns < c) {
        matrix2._ptr.splice(columns + 1, c - columns);
        matrix2._values.splice(matrix2._ptr[columns], matrix2._values.length);
        matrix2._index.splice(matrix2._ptr[columns], matrix2._index.length);
      }
      c = columns;
      if (rows > r) {
        if (ins) {
          var n = 0;
          for (j = 0; j < c; j++) {
            matrix2._ptr[j] = matrix2._ptr[j] + n;
            k = matrix2._ptr[j + 1] + n;
            var p = 0;
            for (i3 = r; i3 < rows; i3++, p++) {
              matrix2._values.splice(k + p, 0, value);
              matrix2._index.splice(k + p, 0, i3);
              n++;
            }
          }
          matrix2._ptr[c] = matrix2._values.length;
        }
      } else if (rows < r) {
        var d = 0;
        for (j = 0; j < c; j++) {
          matrix2._ptr[j] = matrix2._ptr[j] - d;
          var k0 = matrix2._ptr[j];
          var k1 = matrix2._ptr[j + 1] - d;
          for (k = k0; k < k1; k++) {
            i3 = matrix2._index[k];
            if (i3 > rows - 1) {
              matrix2._values.splice(k, 1);
              matrix2._index.splice(k, 1);
              d++;
            }
          }
        }
        matrix2._ptr[j] = matrix2._values.length;
      }
      matrix2._size[0] = rows;
      matrix2._size[1] = columns;
      return matrix2;
    }
    SparseMatrix2.prototype.reshape = function(sizes, copy) {
      if (!isArray(sizes)) {
        throw new TypeError("Array expected");
      }
      if (sizes.length !== 2) {
        throw new Error("Sparse matrices can only be reshaped in two dimensions");
      }
      sizes.forEach(function(value) {
        if (!isNumber(value) || !isInteger(value) || value <= -2 || value === 0) {
          throw new TypeError("Invalid size, must contain positive integers or -1 (size: " + format3(sizes) + ")");
        }
      });
      var currentLength = this._size[0] * this._size[1];
      sizes = processSizesWildcard(sizes, currentLength);
      var newLength = sizes[0] * sizes[1];
      if (currentLength !== newLength) {
        throw new Error("Reshaping sparse matrix will result in the wrong number of elements");
      }
      var m = copy ? this.clone() : this;
      if (this._size[0] === sizes[0] && this._size[1] === sizes[1]) {
        return m;
      }
      var colIndex = [];
      for (var i3 = 0; i3 < m._ptr.length; i3++) {
        for (var j = 0; j < m._ptr[i3 + 1] - m._ptr[i3]; j++) {
          colIndex.push(i3);
        }
      }
      var values = m._values.slice();
      var rowIndex = m._index.slice();
      for (var _i = 0; _i < m._index.length; _i++) {
        var r1 = rowIndex[_i];
        var c1 = colIndex[_i];
        var flat = r1 * m._size[1] + c1;
        colIndex[_i] = flat % sizes[1];
        rowIndex[_i] = Math.floor(flat / sizes[1]);
      }
      m._values.length = 0;
      m._index.length = 0;
      m._ptr.length = sizes[1] + 1;
      m._size = sizes.slice();
      for (var _i2 = 0; _i2 < m._ptr.length; _i2++) {
        m._ptr[_i2] = 0;
      }
      for (var h = 0; h < values.length; h++) {
        var _i3 = rowIndex[h];
        var _j = colIndex[h];
        var v = values[h];
        var k = _getValueIndex(_i3, m._ptr[_j], m._ptr[_j + 1], m._index);
        _insert(k, _i3, _j, v, m._values, m._index, m._ptr);
      }
      return m;
    };
    SparseMatrix2.prototype.clone = function() {
      var m = new SparseMatrix2({
        values: this._values ? clone(this._values) : void 0,
        index: clone(this._index),
        ptr: clone(this._ptr),
        size: clone(this._size),
        datatype: this._datatype
      });
      return m;
    };
    SparseMatrix2.prototype.size = function() {
      return this._size.slice(0);
    };
    SparseMatrix2.prototype.map = function(callback, skipZeros) {
      if (!this._values) {
        throw new Error("Cannot invoke map on a Pattern only matrix");
      }
      var me = this;
      var rows = this._size[0];
      var columns = this._size[1];
      var args = maxArgumentCount(callback);
      var invoke = function invoke2(v, i3, j) {
        if (args === 1)
          return callback(v);
        if (args === 2)
          return callback(v, [i3, j]);
        return callback(v, [i3, j], me);
      };
      return _map3(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
    };
    function _map3(matrix2, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
      var values = [];
      var index2 = [];
      var ptr = [];
      var eq = equalScalar2;
      var zero = 0;
      if (isString(matrix2._datatype)) {
        eq = typed3.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
        zero = typed3.convert(0, matrix2._datatype);
      }
      var invoke = function invoke2(v, x, y2) {
        v = callback(v, x, y2);
        if (!eq(v, zero)) {
          values.push(v);
          index2.push(x);
        }
      };
      for (var j = minColumn; j <= maxColumn; j++) {
        ptr.push(values.length);
        var k0 = matrix2._ptr[j];
        var k1 = matrix2._ptr[j + 1];
        if (skipZeros) {
          for (var k = k0; k < k1; k++) {
            var i3 = matrix2._index[k];
            if (i3 >= minRow && i3 <= maxRow) {
              invoke(matrix2._values[k], i3 - minRow, j - minColumn);
            }
          }
        } else {
          var _values = {};
          for (var _k = k0; _k < k1; _k++) {
            var _i4 = matrix2._index[_k];
            _values[_i4] = matrix2._values[_k];
          }
          for (var _i5 = minRow; _i5 <= maxRow; _i5++) {
            var value = _i5 in _values ? _values[_i5] : 0;
            invoke(value, _i5 - minRow, j - minColumn);
          }
        }
      }
      ptr.push(values.length);
      return new SparseMatrix2({
        values,
        index: index2,
        ptr,
        size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
      });
    }
    SparseMatrix2.prototype.forEach = function(callback, skipZeros) {
      if (!this._values) {
        throw new Error("Cannot invoke forEach on a Pattern only matrix");
      }
      var me = this;
      var rows = this._size[0];
      var columns = this._size[1];
      for (var j = 0; j < columns; j++) {
        var k0 = this._ptr[j];
        var k1 = this._ptr[j + 1];
        if (skipZeros) {
          for (var k = k0; k < k1; k++) {
            var i3 = this._index[k];
            callback(this._values[k], [i3, j], me);
          }
        } else {
          var values = {};
          for (var _k2 = k0; _k2 < k1; _k2++) {
            var _i6 = this._index[_k2];
            values[_i6] = this._values[_k2];
          }
          for (var _i7 = 0; _i7 < rows; _i7++) {
            var value = _i7 in values ? values[_i7] : 0;
            callback(value, [_i7, j], me);
          }
        }
      }
    };
    SparseMatrix2.prototype[Symbol.iterator] = function* () {
      if (!this._values) {
        throw new Error("Cannot iterate a Pattern only matrix");
      }
      var columns = this._size[1];
      for (var j = 0; j < columns; j++) {
        var k0 = this._ptr[j];
        var k1 = this._ptr[j + 1];
        for (var k = k0; k < k1; k++) {
          var i3 = this._index[k];
          yield {
            value: this._values[k],
            index: [i3, j]
          };
        }
      }
    };
    SparseMatrix2.prototype.toArray = function() {
      return _toArray(this._values, this._index, this._ptr, this._size, true);
    };
    SparseMatrix2.prototype.valueOf = function() {
      return _toArray(this._values, this._index, this._ptr, this._size, false);
    };
    function _toArray(values, index2, ptr, size2, copy) {
      var rows = size2[0];
      var columns = size2[1];
      var a = [];
      var i3, j;
      for (i3 = 0; i3 < rows; i3++) {
        a[i3] = [];
        for (j = 0; j < columns; j++) {
          a[i3][j] = 0;
        }
      }
      for (j = 0; j < columns; j++) {
        var k0 = ptr[j];
        var k1 = ptr[j + 1];
        for (var k = k0; k < k1; k++) {
          i3 = index2[k];
          a[i3][j] = values ? copy ? clone(values[k]) : values[k] : 1;
        }
      }
      return a;
    }
    SparseMatrix2.prototype.format = function(options) {
      var rows = this._size[0];
      var columns = this._size[1];
      var density = this.density();
      var str = "Sparse Matrix [" + format3(rows, options) + " x " + format3(columns, options) + "] density: " + format3(density, options) + "\n";
      for (var j = 0; j < columns; j++) {
        var k0 = this._ptr[j];
        var k1 = this._ptr[j + 1];
        for (var k = k0; k < k1; k++) {
          var i3 = this._index[k];
          str += "\n    (" + format3(i3, options) + ", " + format3(j, options) + ") ==> " + (this._values ? format3(this._values[k], options) : "X");
        }
      }
      return str;
    };
    SparseMatrix2.prototype.toString = function() {
      return format3(this.toArray());
    };
    SparseMatrix2.prototype.toJSON = function() {
      return {
        mathjs: "SparseMatrix",
        values: this._values,
        index: this._index,
        ptr: this._ptr,
        size: this._size,
        datatype: this._datatype
      };
    };
    SparseMatrix2.prototype.diagonal = function(k) {
      if (k) {
        if (isBigNumber(k)) {
          k = k.toNumber();
        }
        if (!isNumber(k) || !isInteger(k)) {
          throw new TypeError("The parameter k must be an integer number");
        }
      } else {
        k = 0;
      }
      var kSuper = k > 0 ? k : 0;
      var kSub = k < 0 ? -k : 0;
      var rows = this._size[0];
      var columns = this._size[1];
      var n = Math.min(rows - kSub, columns - kSuper);
      var values = [];
      var index2 = [];
      var ptr = [];
      ptr[0] = 0;
      for (var j = kSuper; j < columns && values.length < n; j++) {
        var k0 = this._ptr[j];
        var k1 = this._ptr[j + 1];
        for (var x = k0; x < k1; x++) {
          var i3 = this._index[x];
          if (i3 === j - kSuper + kSub) {
            values.push(this._values[x]);
            index2[values.length - 1] = i3 - kSub;
            break;
          }
        }
      }
      ptr.push(values.length);
      return new SparseMatrix2({
        values,
        index: index2,
        ptr,
        size: [n, 1]
      });
    };
    SparseMatrix2.fromJSON = function(json) {
      return new SparseMatrix2(json);
    };
    SparseMatrix2.diagonal = function(size2, value, k, defaultValue, datatype) {
      if (!isArray(size2)) {
        throw new TypeError("Array expected, size parameter");
      }
      if (size2.length !== 2) {
        throw new Error("Only two dimensions matrix are supported");
      }
      size2 = size2.map(function(s) {
        if (isBigNumber(s)) {
          s = s.toNumber();
        }
        if (!isNumber(s) || !isInteger(s) || s < 1) {
          throw new Error("Size values must be positive integers");
        }
        return s;
      });
      if (k) {
        if (isBigNumber(k)) {
          k = k.toNumber();
        }
        if (!isNumber(k) || !isInteger(k)) {
          throw new TypeError("The parameter k must be an integer number");
        }
      } else {
        k = 0;
      }
      var eq = equalScalar2;
      var zero = 0;
      if (isString(datatype)) {
        eq = typed3.find(equalScalar2, [datatype, datatype]) || equalScalar2;
        zero = typed3.convert(0, datatype);
      }
      var kSuper = k > 0 ? k : 0;
      var kSub = k < 0 ? -k : 0;
      var rows = size2[0];
      var columns = size2[1];
      var n = Math.min(rows - kSub, columns - kSuper);
      var _value;
      if (isArray(value)) {
        if (value.length !== n) {
          throw new Error("Invalid value array length");
        }
        _value = function _value2(i4) {
          return value[i4];
        };
      } else if (isMatrix(value)) {
        var ms = value.size();
        if (ms.length !== 1 || ms[0] !== n) {
          throw new Error("Invalid matrix length");
        }
        _value = function _value2(i4) {
          return value.get([i4]);
        };
      } else {
        _value = function _value2() {
          return value;
        };
      }
      var values = [];
      var index2 = [];
      var ptr = [];
      for (var j = 0; j < columns; j++) {
        ptr.push(values.length);
        var i3 = j - kSuper;
        if (i3 >= 0 && i3 < n) {
          var v = _value(i3);
          if (!eq(v, zero)) {
            index2.push(i3 + kSub);
            values.push(v);
          }
        }
      }
      ptr.push(values.length);
      return new SparseMatrix2({
        values,
        index: index2,
        ptr,
        size: [rows, columns]
      });
    };
    SparseMatrix2.prototype.swapRows = function(i3, j) {
      if (!isNumber(i3) || !isInteger(i3) || !isNumber(j) || !isInteger(j)) {
        throw new Error("Row index must be positive integers");
      }
      if (this._size.length !== 2) {
        throw new Error("Only two dimensional matrix is supported");
      }
      validateIndex(i3, this._size[0]);
      validateIndex(j, this._size[0]);
      SparseMatrix2._swapRows(i3, j, this._size[1], this._values, this._index, this._ptr);
      return this;
    };
    SparseMatrix2._forEachRow = function(j, values, index2, ptr, callback) {
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        callback(index2[k], values[k]);
      }
    };
    SparseMatrix2._swapRows = function(x, y2, columns, values, index2, ptr) {
      for (var j = 0; j < columns; j++) {
        var k0 = ptr[j];
        var k1 = ptr[j + 1];
        var kx = _getValueIndex(x, k0, k1, index2);
        var ky = _getValueIndex(y2, k0, k1, index2);
        if (kx < k1 && ky < k1 && index2[kx] === x && index2[ky] === y2) {
          if (values) {
            var v = values[kx];
            values[kx] = values[ky];
            values[ky] = v;
          }
          continue;
        }
        if (kx < k1 && index2[kx] === x && (ky >= k1 || index2[ky] !== y2)) {
          var vx = values ? values[kx] : void 0;
          index2.splice(ky, 0, y2);
          if (values) {
            values.splice(ky, 0, vx);
          }
          index2.splice(ky <= kx ? kx + 1 : kx, 1);
          if (values) {
            values.splice(ky <= kx ? kx + 1 : kx, 1);
          }
          continue;
        }
        if (ky < k1 && index2[ky] === y2 && (kx >= k1 || index2[kx] !== x)) {
          var vy = values ? values[ky] : void 0;
          index2.splice(kx, 0, x);
          if (values) {
            values.splice(kx, 0, vy);
          }
          index2.splice(kx <= ky ? ky + 1 : ky, 1);
          if (values) {
            values.splice(kx <= ky ? ky + 1 : ky, 1);
          }
        }
      }
    };
    return SparseMatrix2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/number.js
  var name19 = "number";
  var dependencies20 = ["typed"];
  function getNonDecimalNumberParts(input2) {
    var nonDecimalWithRadixMatch = input2.match(/(0[box])([0-9a-fA-F]*)\.([0-9a-fA-F]*)/);
    if (nonDecimalWithRadixMatch) {
      var radix = {
        "0b": 2,
        "0o": 8,
        "0x": 16
      }[nonDecimalWithRadixMatch[1]];
      var integerPart = nonDecimalWithRadixMatch[2];
      var fractionalPart = nonDecimalWithRadixMatch[3];
      return {
        input: input2,
        radix,
        integerPart,
        fractionalPart
      };
    } else {
      return null;
    }
  }
  function makeNumberFromNonDecimalParts(parts) {
    var n = parseInt(parts.integerPart, parts.radix);
    var f = 0;
    for (var i3 = 0; i3 < parts.fractionalPart.length; i3++) {
      var digitValue = parseInt(parts.fractionalPart[i3], parts.radix);
      f += digitValue / Math.pow(parts.radix, i3 + 1);
    }
    var result = n + f;
    if (isNaN(result)) {
      throw new SyntaxError('String "' + parts.input + '" is not a valid number');
    }
    return result;
  }
  var createNumber = /* @__PURE__ */ factory(name19, dependencies20, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    var number2 = typed3("number", {
      "": function _() {
        return 0;
      },
      number: function number3(x) {
        return x;
      },
      string: function string2(x) {
        if (x === "NaN")
          return NaN;
        var nonDecimalNumberParts = getNonDecimalNumberParts(x);
        if (nonDecimalNumberParts) {
          return makeNumberFromNonDecimalParts(nonDecimalNumberParts);
        }
        var size2 = 0;
        var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);
        if (wordSizeSuffixMatch) {
          size2 = Number(wordSizeSuffixMatch[2]);
          x = wordSizeSuffixMatch[1];
        }
        var num = Number(x);
        if (isNaN(num)) {
          throw new SyntaxError('String "' + x + '" is not a valid number');
        }
        if (wordSizeSuffixMatch) {
          if (num > 2 ** size2 - 1) {
            throw new SyntaxError('String "'.concat(x, '" is out of range'));
          }
          if (num >= 2 ** (size2 - 1)) {
            num = num - 2 ** size2;
          }
        }
        return num;
      },
      BigNumber: function BigNumber2(x) {
        return x.toNumber();
      },
      Fraction: function Fraction3(x) {
        return x.valueOf();
      },
      Unit: typed3.referToSelf((self2) => (x) => {
        var clone5 = x.clone();
        clone5.value = self2(x.value);
        return clone5;
      }),
      null: function _null2(x) {
        return 0;
      },
      "Unit, string | Unit": function UnitStringUnit(unit2, valuelessUnit) {
        return unit2.toNumber(valuelessUnit);
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
    number2.fromJSON = function(json) {
      return parseFloat(json.value);
    };
    return number2;
  });

  // node_modules/mathjs/lib/esm/type/string.js
  var name20 = "string";
  var dependencies21 = ["typed"];
  var createString = /* @__PURE__ */ factory(name20, dependencies21, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name20, {
      "": function _() {
        return "";
      },
      number: format,
      null: function _null2(x) {
        return "null";
      },
      boolean: function boolean2(x) {
        return x + "";
      },
      string: function string2(x) {
        return x;
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2)),
      any: function any(x) {
        return String(x);
      }
    });
  });

  // node_modules/mathjs/lib/esm/type/boolean.js
  var name21 = "boolean";
  var dependencies22 = ["typed"];
  var createBoolean = /* @__PURE__ */ factory(name21, dependencies22, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name21, {
      "": function _() {
        return false;
      },
      boolean: function boolean2(x) {
        return x;
      },
      number: function number2(x) {
        return !!x;
      },
      null: function _null2(x) {
        return false;
      },
      BigNumber: function BigNumber2(x) {
        return !x.isZero();
      },
      string: function string2(x) {
        var lcase = x.toLowerCase();
        if (lcase === "true") {
          return true;
        } else if (lcase === "false") {
          return false;
        }
        var num = Number(x);
        if (x !== "" && !isNaN(num)) {
          return !!num;
        }
        throw new Error('Cannot convert "' + x + '" to a boolean');
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/type/bignumber/function/bignumber.js
  var name22 = "bignumber";
  var dependencies23 = ["typed", "BigNumber"];
  var createBignumber = /* @__PURE__ */ factory(name22, dependencies23, (_ref) => {
    var {
      typed: typed3,
      BigNumber: BigNumber2
    } = _ref;
    return typed3("bignumber", {
      "": function _() {
        return new BigNumber2(0);
      },
      number: function number2(x) {
        return new BigNumber2(x + "");
      },
      string: function string2(x) {
        var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);
        if (wordSizeSuffixMatch) {
          var size2 = wordSizeSuffixMatch[2];
          var n = BigNumber2(wordSizeSuffixMatch[1]);
          var twoPowSize = new BigNumber2(2).pow(Number(size2));
          if (n.gt(twoPowSize.sub(1))) {
            throw new SyntaxError('String "'.concat(x, '" is out of range'));
          }
          var twoPowSizeSubOne = new BigNumber2(2).pow(Number(size2) - 1);
          if (n.gte(twoPowSizeSubOne)) {
            return n.sub(twoPowSize);
          } else {
            return n;
          }
        }
        return new BigNumber2(x);
      },
      BigNumber: function BigNumber3(x) {
        return x;
      },
      Unit: typed3.referToSelf((self2) => (x) => {
        var clone5 = x.clone();
        clone5.value = self2(x.value);
        return clone5;
      }),
      Fraction: function Fraction3(x) {
        return new BigNumber2(x.n).div(x.d).times(x.s);
      },
      null: function _null2(x) {
        return new BigNumber2(0);
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/type/complex/function/complex.js
  var name23 = "complex";
  var dependencies24 = ["typed", "Complex"];
  var createComplex = /* @__PURE__ */ factory(name23, dependencies24, (_ref) => {
    var {
      typed: typed3,
      Complex: Complex3
    } = _ref;
    return typed3("complex", {
      "": function _() {
        return Complex3.ZERO;
      },
      number: function number2(x) {
        return new Complex3(x, 0);
      },
      "number, number": function numberNumber(re2, im2) {
        return new Complex3(re2, im2);
      },
      // TODO: this signature should be redundant
      "BigNumber, BigNumber": function BigNumberBigNumber(re2, im2) {
        return new Complex3(re2.toNumber(), im2.toNumber());
      },
      Fraction: function Fraction3(x) {
        return new Complex3(x.valueOf(), 0);
      },
      Complex: function Complex4(x) {
        return x.clone();
      },
      string: function string2(x) {
        return Complex3(x);
      },
      null: function _null2(x) {
        return Complex3(0);
      },
      Object: function Object2(x) {
        if ("re" in x && "im" in x) {
          return new Complex3(x.re, x.im);
        }
        if ("r" in x && "phi" in x || "abs" in x && "arg" in x) {
          return new Complex3(x);
        }
        throw new Error("Expected object with properties (re and im) or (r and phi) or (abs and arg)");
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/type/fraction/function/fraction.js
  var name24 = "fraction";
  var dependencies25 = ["typed", "Fraction"];
  var createFraction = /* @__PURE__ */ factory(name24, dependencies25, (_ref) => {
    var {
      typed: typed3,
      Fraction: Fraction3
    } = _ref;
    return typed3("fraction", {
      number: function number2(x) {
        if (!isFinite(x) || isNaN(x)) {
          throw new Error(x + " cannot be represented as a fraction");
        }
        return new Fraction3(x);
      },
      string: function string2(x) {
        return new Fraction3(x);
      },
      "number, number": function numberNumber(numerator, denominator) {
        return new Fraction3(numerator, denominator);
      },
      null: function _null2(x) {
        return new Fraction3(0);
      },
      BigNumber: function BigNumber2(x) {
        return new Fraction3(x.toString());
      },
      Fraction: function Fraction4(x) {
        return x;
      },
      Unit: typed3.referToSelf((self2) => (x) => {
        var clone5 = x.clone();
        clone5.value = self2(x.value);
        return clone5;
      }),
      Object: function Object2(x) {
        return new Fraction3(x);
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/type/matrix/function/matrix.js
  var name25 = "matrix";
  var dependencies26 = ["typed", "Matrix", "DenseMatrix", "SparseMatrix"];
  var createMatrix = /* @__PURE__ */ factory(name25, dependencies26, (_ref) => {
    var {
      typed: typed3,
      Matrix: Matrix2,
      DenseMatrix: DenseMatrix2,
      SparseMatrix: SparseMatrix2
    } = _ref;
    return typed3(name25, {
      "": function _() {
        return _create([]);
      },
      string: function string2(format5) {
        return _create([], format5);
      },
      "string, string": function stringString(format5, datatype) {
        return _create([], format5, datatype);
      },
      Array: function Array2(data) {
        return _create(data);
      },
      Matrix: function Matrix3(data) {
        return _create(data, data.storage());
      },
      "Array | Matrix, string": _create,
      "Array | Matrix, string, string": _create
    });
    function _create(data, format5, datatype) {
      if (format5 === "dense" || format5 === "default" || format5 === void 0) {
        return new DenseMatrix2(data, datatype);
      }
      if (format5 === "sparse") {
        return new SparseMatrix2(data, datatype);
      }
      throw new TypeError("Unknown matrix type " + JSON.stringify(format5) + ".");
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/matrixFromFunction.js
  var name26 = "matrixFromFunction";
  var dependencies27 = ["typed", "matrix", "isZero"];
  var createMatrixFromFunction = /* @__PURE__ */ factory(name26, dependencies27, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      isZero: isZero2
    } = _ref;
    return typed3(name26, {
      "Array | Matrix, function, string, string": function ArrayMatrixFunctionStringString(size2, fn, format5, datatype) {
        return _create(size2, fn, format5, datatype);
      },
      "Array | Matrix, function, string": function ArrayMatrixFunctionString(size2, fn, format5) {
        return _create(size2, fn, format5);
      },
      "Matrix, function": function MatrixFunction(size2, fn) {
        return _create(size2, fn, "dense");
      },
      "Array, function": function ArrayFunction(size2, fn) {
        return _create(size2, fn, "dense").toArray();
      },
      "Array | Matrix, string, function": function ArrayMatrixStringFunction(size2, format5, fn) {
        return _create(size2, fn, format5);
      },
      "Array | Matrix, string, string, function": function ArrayMatrixStringStringFunction(size2, format5, datatype, fn) {
        return _create(size2, fn, format5, datatype);
      }
    });
    function _create(size2, fn, format5, datatype) {
      var m;
      if (datatype !== void 0) {
        m = matrix2(format5, datatype);
      } else {
        m = matrix2(format5);
      }
      m.resize(size2);
      m.forEach(function(_, index2) {
        var val = fn(index2);
        if (isZero2(val))
          return;
        m.set(index2, val);
      });
      return m;
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/matrixFromRows.js
  var name27 = "matrixFromRows";
  var dependencies28 = ["typed", "matrix", "flatten", "size"];
  var createMatrixFromRows = /* @__PURE__ */ factory(name27, dependencies28, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      flatten: flatten3,
      size: size2
    } = _ref;
    return typed3(name27, {
      "...Array": function Array2(arr) {
        return _createArray(arr);
      },
      "...Matrix": function Matrix2(arr) {
        return matrix2(_createArray(arr.map((m) => m.toArray())));
      }
      // TODO implement this properly for SparseMatrix
    });
    function _createArray(arr) {
      if (arr.length === 0)
        throw new TypeError("At least one row is needed to construct a matrix.");
      var N = checkVectorTypeAndReturnLength(arr[0]);
      var result = [];
      for (var row2 of arr) {
        var rowLength = checkVectorTypeAndReturnLength(row2);
        if (rowLength !== N) {
          throw new TypeError("The vectors had different length: " + (N | 0) + " \u2260 " + (rowLength | 0));
        }
        result.push(flatten3(row2));
      }
      return result;
    }
    function checkVectorTypeAndReturnLength(vec) {
      var s = size2(vec);
      if (s.length === 1) {
        return s[0];
      } else if (s.length === 2) {
        if (s[0] === 1) {
          return s[1];
        } else if (s[1] === 1) {
          return s[0];
        } else {
          throw new TypeError("At least one of the arguments is not a vector.");
        }
      } else {
        throw new TypeError("Only one- or two-dimensional vectors are supported.");
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/matrixFromColumns.js
  var name28 = "matrixFromColumns";
  var dependencies29 = ["typed", "matrix", "flatten", "size"];
  var createMatrixFromColumns = /* @__PURE__ */ factory(name28, dependencies29, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      flatten: flatten3,
      size: size2
    } = _ref;
    return typed3(name28, {
      "...Array": function Array2(arr) {
        return _createArray(arr);
      },
      "...Matrix": function Matrix2(arr) {
        return matrix2(_createArray(arr.map((m) => m.toArray())));
      }
      // TODO implement this properly for SparseMatrix
    });
    function _createArray(arr) {
      if (arr.length === 0)
        throw new TypeError("At least one column is needed to construct a matrix.");
      var N = checkVectorTypeAndReturnLength(arr[0]);
      var result = [];
      for (var i3 = 0; i3 < N; i3++) {
        result[i3] = [];
      }
      for (var col of arr) {
        var colLength = checkVectorTypeAndReturnLength(col);
        if (colLength !== N) {
          throw new TypeError("The vectors had different length: " + (N | 0) + " \u2260 " + (colLength | 0));
        }
        var f = flatten3(col);
        for (var _i = 0; _i < N; _i++) {
          result[_i].push(f[_i]);
        }
      }
      return result;
    }
    function checkVectorTypeAndReturnLength(vec) {
      var s = size2(vec);
      if (s.length === 1) {
        return s[0];
      } else if (s.length === 2) {
        if (s[0] === 1) {
          return s[1];
        } else if (s[1] === 1) {
          return s[0];
        } else {
          throw new TypeError("At least one of the arguments is not a vector.");
        }
      } else {
        throw new TypeError("Only one- or two-dimensional vectors are supported.");
      }
    }
  });

  // node_modules/mathjs/lib/esm/type/unit/function/splitUnit.js
  var name29 = "splitUnit";
  var dependencies30 = ["typed"];
  var createSplitUnit = /* @__PURE__ */ factory(name29, dependencies30, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name29, {
      "Unit, Array": function UnitArray(unit2, parts) {
        return unit2.splitUnit(parts);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/unaryMinus.js
  var name30 = "unaryMinus";
  var dependencies31 = ["typed"];
  var createUnaryMinus = /* @__PURE__ */ factory(name30, dependencies31, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name30, {
      number: unaryMinusNumber,
      "Complex | BigNumber | Fraction": (x) => x.neg(),
      Unit: typed3.referToSelf((self2) => (x) => {
        var res = x.clone();
        res.value = typed3.find(self2, res.valueType())(x.value);
        return res;
      }),
      // deep map collection, skip zeros since unaryMinus(0) = 0
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2, true))
      // TODO: add support for string
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/unaryPlus.js
  var name31 = "unaryPlus";
  var dependencies32 = ["typed", "config", "BigNumber"];
  var createUnaryPlus = /* @__PURE__ */ factory(name31, dependencies32, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      BigNumber: BigNumber2
    } = _ref;
    return typed3(name31, {
      number: unaryPlusNumber,
      Complex: function Complex3(x) {
        return x;
      },
      BigNumber: function BigNumber3(x) {
        return x;
      },
      Fraction: function Fraction3(x) {
        return x;
      },
      Unit: function Unit2(x) {
        return x.clone();
      },
      // deep map collection, skip zeros since unaryPlus(0) = 0
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2, true)),
      "boolean | string": function booleanString(x) {
        return config4.number === "BigNumber" ? new BigNumber2(+x) : +x;
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/abs.js
  var name32 = "abs";
  var dependencies33 = ["typed"];
  var createAbs = /* @__PURE__ */ factory(name32, dependencies33, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name32, {
      number: absNumber,
      "Complex | BigNumber | Fraction | Unit": (x) => x.abs(),
      // deep map collection, skip zeros since abs(0) = 0
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2, true))
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/apply.js
  var name33 = "apply";
  var dependencies34 = ["typed", "isInteger"];
  var createApply = /* @__PURE__ */ factory(name33, dependencies34, (_ref) => {
    var {
      typed: typed3,
      isInteger: isInteger3
    } = _ref;
    return typed3(name33, {
      "Array | Matrix, number | BigNumber, function": function ArrayMatrixNumberBigNumberFunction(mat, dim, callback) {
        if (!isInteger3(dim)) {
          throw new TypeError("Integer number expected for dimension");
        }
        var size2 = Array.isArray(mat) ? arraySize(mat) : mat.size();
        if (dim < 0 || dim >= size2.length) {
          throw new IndexError(dim, size2.length);
        }
        if (isMatrix(mat)) {
          return mat.create(_apply(mat.valueOf(), dim, callback));
        } else {
          return _apply(mat, dim, callback);
        }
      }
    });
  });
  function _apply(mat, dim, callback) {
    var i3, ret, tran;
    if (dim <= 0) {
      if (!Array.isArray(mat[0])) {
        return callback(mat);
      } else {
        tran = _switch2(mat);
        ret = [];
        for (i3 = 0; i3 < tran.length; i3++) {
          ret[i3] = _apply(tran[i3], dim - 1, callback);
        }
        return ret;
      }
    } else {
      ret = [];
      for (i3 = 0; i3 < mat.length; i3++) {
        ret[i3] = _apply(mat[i3], dim - 1, callback);
      }
      return ret;
    }
  }
  function _switch2(mat) {
    var I2 = mat.length;
    var J = mat[0].length;
    var i3, j;
    var ret = [];
    for (j = 0; j < J; j++) {
      var tmp = [];
      for (i3 = 0; i3 < I2; i3++) {
        tmp.push(mat[i3][j]);
      }
      ret.push(tmp);
    }
    return ret;
  }

  // node_modules/mathjs/lib/esm/function/arithmetic/addScalar.js
  var name34 = "addScalar";
  var dependencies35 = ["typed"];
  var createAddScalar = /* @__PURE__ */ factory(name34, dependencies35, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name34, {
      "number, number": addNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.add(y2);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.plus(y2);
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return x.add(y2);
      },
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => {
        if (x.value === null || x.value === void 0) {
          throw new Error("Parameter x contains a unit with undefined value");
        }
        if (y2.value === null || y2.value === void 0) {
          throw new Error("Parameter y contains a unit with undefined value");
        }
        if (!x.equalBase(y2))
          throw new Error("Units do not match");
        var res = x.clone();
        res.value = typed3.find(self2, [res.valueType(), y2.valueType()])(res.value, y2.value);
        res.fixPrefix = false;
        return res;
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/subtractScalar.js
  var name35 = "subtractScalar";
  var dependencies36 = ["typed"];
  var createSubtractScalar = /* @__PURE__ */ factory(name35, dependencies36, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name35, {
      "number, number": subtractNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.sub(y2);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.minus(y2);
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return x.sub(y2);
      },
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => {
        if (x.value === null || x.value === void 0) {
          throw new Error("Parameter x contains a unit with undefined value");
        }
        if (y2.value === null || y2.value === void 0) {
          throw new Error("Parameter y contains a unit with undefined value");
        }
        if (!x.equalBase(y2))
          throw new Error("Units do not match");
        var res = x.clone();
        res.value = typed3.find(self2, [res.valueType(), y2.valueType()])(res.value, y2.value);
        res.fixPrefix = false;
        return res;
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/cbrt.js
  var name36 = "cbrt";
  var dependencies37 = ["config", "typed", "isNegative", "unaryMinus", "matrix", "Complex", "BigNumber", "Fraction"];
  var createCbrt = /* @__PURE__ */ factory(name36, dependencies37, (_ref) => {
    var {
      config: config4,
      typed: typed3,
      isNegative: isNegative2,
      unaryMinus: unaryMinus2,
      matrix: matrix2,
      Complex: Complex3,
      BigNumber: BigNumber2,
      Fraction: Fraction3
    } = _ref;
    return typed3(name36, {
      number: cbrtNumber,
      // note: signature 'number, boolean' is also supported,
      //       created by typed as it knows how to convert number to Complex
      Complex: _cbrtComplex,
      "Complex, boolean": _cbrtComplex,
      BigNumber: function BigNumber3(x) {
        return x.cbrt();
      },
      Unit: _cbrtUnit
    });
    function _cbrtComplex(x, allRoots) {
      var arg3 = x.arg() / 3;
      var abs3 = x.abs();
      var principal = new Complex3(cbrtNumber(abs3), 0).mul(new Complex3(0, arg3).exp());
      if (allRoots) {
        var all = [principal, new Complex3(cbrtNumber(abs3), 0).mul(new Complex3(0, arg3 + Math.PI * 2 / 3).exp()), new Complex3(cbrtNumber(abs3), 0).mul(new Complex3(0, arg3 - Math.PI * 2 / 3).exp())];
        return config4.matrix === "Array" ? all : matrix2(all);
      } else {
        return principal;
      }
    }
    function _cbrtUnit(x) {
      if (x.value && isComplex(x.value)) {
        var result = x.clone();
        result.value = 1;
        result = result.pow(1 / 3);
        result.value = _cbrtComplex(x.value);
        return result;
      } else {
        var negate = isNegative2(x.value);
        if (negate) {
          x.value = unaryMinus2(x.value);
        }
        var third;
        if (isBigNumber(x.value)) {
          third = new BigNumber2(1).div(3);
        } else if (isFraction(x.value)) {
          third = new Fraction3(1, 3);
        } else {
          third = 1 / 3;
        }
        var _result = x.pow(third);
        if (negate) {
          _result.value = unaryMinus2(_result.value);
        }
        return _result;
      }
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo11xS0s.js
  var name37 = "matAlgo11xS0s";
  var dependencies38 = ["typed", "equalScalar"];
  var createMatAlgo11xS0s = /* @__PURE__ */ factory(name37, dependencies38, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo11xS0s(s, b, callback, inverse) {
      var avalues = s._values;
      var aindex = s._index;
      var aptr = s._ptr;
      var asize = s._size;
      var adt = s._datatype;
      if (!avalues) {
        throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string") {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        b = typed3.convert(b, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      for (var j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          var i3 = aindex[k];
          var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b);
          if (!eq(v, zero)) {
            cindex.push(i3);
            cvalues.push(v);
          }
        }
      }
      cptr[columns] = cindex.length;
      return s.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo12xSfs.js
  var name38 = "matAlgo12xSfs";
  var dependencies39 = ["typed", "DenseMatrix"];
  var createMatAlgo12xSfs = /* @__PURE__ */ factory(name38, dependencies39, (_ref) => {
    var {
      typed: typed3,
      DenseMatrix: DenseMatrix2
    } = _ref;
    return function matAlgo12xSfs(s, b, callback, inverse) {
      var avalues = s._values;
      var aindex = s._index;
      var aptr = s._ptr;
      var asize = s._size;
      var adt = s._datatype;
      if (!avalues) {
        throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var cf = callback;
      if (typeof adt === "string") {
        dt = adt;
        b = typed3.convert(b, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cdata = [];
      var x = [];
      var w2 = [];
      for (var j = 0; j < columns; j++) {
        var mark = j + 1;
        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          var r = aindex[k];
          x[r] = avalues[k];
          w2[r] = mark;
        }
        for (var i3 = 0; i3 < rows; i3++) {
          if (j === 0) {
            cdata[i3] = [];
          }
          if (w2[i3] === mark) {
            cdata[i3][j] = inverse ? cf(b, x[i3]) : cf(x[i3], b);
          } else {
            cdata[i3][j] = inverse ? cf(b, 0) : cf(0, b);
          }
        }
      }
      return new DenseMatrix2({
        data: cdata,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo14xDs.js
  var name39 = "matAlgo14xDs";
  var dependencies40 = ["typed"];
  var createMatAlgo14xDs = /* @__PURE__ */ factory(name39, dependencies40, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return function matAlgo14xDs(a, b, callback, inverse) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var dt;
      var cf = callback;
      if (typeof adt === "string") {
        dt = adt;
        b = typed3.convert(b, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];
      return a.createDenseMatrix({
        data: cdata,
        size: clone(asize),
        datatype: dt
      });
    };
    function _iterate(f, level, s, n, av, bv, inverse) {
      var cv = [];
      if (level === s.length - 1) {
        for (var i3 = 0; i3 < n; i3++) {
          cv[i3] = inverse ? f(bv, av[i3]) : f(av[i3], bv);
        }
      } else {
        for (var j = 0; j < n; j++) {
          cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
        }
      }
      return cv;
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/ceil.js
  var name40 = "ceil";
  var dependencies41 = ["typed", "config", "round", "matrix", "equalScalar", "zeros", "DenseMatrix"];
  var createCeilNumber = /* @__PURE__ */ factory(name40, ["typed", "config", "round"], (_ref) => {
    var {
      typed: typed3,
      config: config4,
      round: round3
    } = _ref;
    return typed3(name40, {
      number: function number2(x) {
        if (nearlyEqual(x, round3(x), config4.epsilon)) {
          return round3(x);
        } else {
          return Math.ceil(x);
        }
      },
      "number, number": function numberNumber(x, n) {
        if (nearlyEqual(x, round3(x, n), config4.epsilon)) {
          return round3(x, n);
        } else {
          var [number2, exponent] = "".concat(x, "e").split("e");
          var result = Math.ceil(Number("".concat(number2, "e").concat(Number(exponent) + n)));
          [number2, exponent] = "".concat(result, "e").split("e");
          return Number("".concat(number2, "e").concat(Number(exponent) - n));
        }
      }
    });
  });
  var createCeil = /* @__PURE__ */ factory(name40, dependencies41, (_ref2) => {
    var {
      typed: typed3,
      config: config4,
      round: round3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2
    } = _ref2;
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var ceilNumber = createCeilNumber({
      typed: typed3,
      config: config4,
      round: round3
    });
    return typed3("ceil", {
      number: ceilNumber.signatures.number,
      "number,number": ceilNumber.signatures["number,number"],
      Complex: function Complex3(x) {
        return x.ceil();
      },
      "Complex, number": function ComplexNumber(x, n) {
        return x.ceil(n);
      },
      "Complex, BigNumber": function ComplexBigNumber(x, n) {
        return x.ceil(n.toNumber());
      },
      BigNumber: function BigNumber2(x) {
        if (nearlyEqual2(x, round3(x), config4.epsilon)) {
          return round3(x);
        } else {
          return x.ceil();
        }
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, n) {
        if (nearlyEqual2(x, round3(x, n), config4.epsilon)) {
          return round3(x, n);
        } else {
          return x.toDecimalPlaces(n.toNumber(), decimal_default.ROUND_CEIL);
        }
      },
      Fraction: function Fraction3(x) {
        return x.ceil();
      },
      "Fraction, number": function FractionNumber(x, n) {
        return x.ceil(n);
      },
      "Fraction, BigNumber": function FractionBigNumber(x, n) {
        return x.ceil(n.toNumber());
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => {
        return deepMap(x, self2, true);
      }),
      "Array, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return deepMap(x, (i3) => self2(i3, n), true);
      }),
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "number | Complex | Fraction | BigNumber, Array": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo14xDs(matrix2(y2), x, self2, true).valueOf();
      }),
      "number | Complex | Fraction | BigNumber, Matrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0))
          return zeros3(y2.size(), y2.storage());
        if (y2.storage() === "dense") {
          return matAlgo14xDs(y2, x, self2, true);
        }
        return matAlgo12xSfs(y2, x, self2, true);
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/cube.js
  var name41 = "cube";
  var dependencies42 = ["typed"];
  var createCube = /* @__PURE__ */ factory(name41, dependencies42, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name41, {
      number: cubeNumber,
      Complex: function Complex3(x) {
        return x.mul(x).mul(x);
      },
      BigNumber: function BigNumber2(x) {
        return x.times(x).times(x);
      },
      Fraction: function Fraction3(x) {
        return x.pow(3);
      },
      Unit: function Unit2(x) {
        return x.pow(3);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/exp.js
  var name42 = "exp";
  var dependencies43 = ["typed"];
  var createExp = /* @__PURE__ */ factory(name42, dependencies43, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name42, {
      number: expNumber,
      Complex: function Complex3(x) {
        return x.exp();
      },
      BigNumber: function BigNumber2(x) {
        return x.exp();
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/expm1.js
  var name43 = "expm1";
  var dependencies44 = ["typed", "Complex"];
  var createExpm1 = /* @__PURE__ */ factory(name43, dependencies44, (_ref) => {
    var {
      typed: typed3,
      Complex: _Complex
    } = _ref;
    return typed3(name43, {
      number: expm1Number,
      Complex: function Complex3(x) {
        var r = Math.exp(x.re);
        return new _Complex(r * Math.cos(x.im) - 1, r * Math.sin(x.im));
      },
      BigNumber: function BigNumber2(x) {
        return x.exp().minus(1);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/fix.js
  var name44 = "fix";
  var dependencies45 = ["typed", "Complex", "matrix", "ceil", "floor", "equalScalar", "zeros", "DenseMatrix"];
  var createFixNumber = /* @__PURE__ */ factory(name44, ["typed", "ceil", "floor"], (_ref) => {
    var {
      typed: typed3,
      ceil: ceil3,
      floor: floor3
    } = _ref;
    return typed3(name44, {
      number: function number2(x) {
        return x > 0 ? floor3(x) : ceil3(x);
      },
      "number, number": function numberNumber(x, n) {
        return x > 0 ? floor3(x, n) : ceil3(x, n);
      }
    });
  });
  var createFix = /* @__PURE__ */ factory(name44, dependencies45, (_ref2) => {
    var {
      typed: typed3,
      Complex: _Complex,
      matrix: matrix2,
      ceil: ceil3,
      floor: floor3,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2
    } = _ref2;
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var fixNumber = createFixNumber({
      typed: typed3,
      ceil: ceil3,
      floor: floor3
    });
    return typed3("fix", {
      number: fixNumber.signatures.number,
      "number, number | BigNumber": fixNumber.signatures["number,number"],
      Complex: function Complex3(x) {
        return new _Complex(x.re > 0 ? Math.floor(x.re) : Math.ceil(x.re), x.im > 0 ? Math.floor(x.im) : Math.ceil(x.im));
      },
      "Complex, number": function ComplexNumber(x, n) {
        return new _Complex(x.re > 0 ? floor3(x.re, n) : ceil3(x.re, n), x.im > 0 ? floor3(x.im, n) : ceil3(x.im, n));
      },
      "Complex, BigNumber": function ComplexBigNumber(x, bn) {
        var n = bn.toNumber();
        return new _Complex(x.re > 0 ? floor3(x.re, n) : ceil3(x.re, n), x.im > 0 ? floor3(x.im, n) : ceil3(x.im, n));
      },
      BigNumber: function BigNumber2(x) {
        return x.isNegative() ? ceil3(x) : floor3(x);
      },
      "BigNumber, number | BigNumber": function BigNumberNumberBigNumber(x, n) {
        return x.isNegative() ? ceil3(x, n) : floor3(x, n);
      },
      Fraction: function Fraction3(x) {
        return x.s < 0 ? x.ceil() : x.floor();
      },
      "Fraction, number | BigNumber": function FractionNumberBigNumber(x, n) {
        return x.s < 0 ? ceil3(x, n) : floor3(x, n);
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => {
        return deepMap(x, self2, true);
      }),
      "Array | Matrix, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return deepMap(x, (i3) => self2(i3, n), true);
      }),
      "number | Complex | Fraction | BigNumber, Array": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo14xDs(matrix2(y2), x, self2, true).valueOf();
      }),
      "number | Complex | Fraction | BigNumber, Matrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0))
          return zeros3(y2.size(), y2.storage());
        if (y2.storage() === "dense") {
          return matAlgo14xDs(y2, x, self2, true);
        }
        return matAlgo12xSfs(y2, x, self2, true);
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/floor.js
  var name45 = "floor";
  var dependencies46 = ["typed", "config", "round", "matrix", "equalScalar", "zeros", "DenseMatrix"];
  var createFloorNumber = /* @__PURE__ */ factory(name45, ["typed", "config", "round"], (_ref) => {
    var {
      typed: typed3,
      config: config4,
      round: round3
    } = _ref;
    return typed3(name45, {
      number: function number2(x) {
        if (nearlyEqual(x, round3(x), config4.epsilon)) {
          return round3(x);
        } else {
          return Math.floor(x);
        }
      },
      "number, number": function numberNumber(x, n) {
        if (nearlyEqual(x, round3(x, n), config4.epsilon)) {
          return round3(x, n);
        } else {
          var [number2, exponent] = "".concat(x, "e").split("e");
          var result = Math.floor(Number("".concat(number2, "e").concat(Number(exponent) + n)));
          [number2, exponent] = "".concat(result, "e").split("e");
          return Number("".concat(number2, "e").concat(Number(exponent) - n));
        }
      }
    });
  });
  var createFloor = /* @__PURE__ */ factory(name45, dependencies46, (_ref2) => {
    var {
      typed: typed3,
      config: config4,
      round: round3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2
    } = _ref2;
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var floorNumber = createFloorNumber({
      typed: typed3,
      config: config4,
      round: round3
    });
    return typed3("floor", {
      number: floorNumber.signatures.number,
      "number,number": floorNumber.signatures["number,number"],
      Complex: function Complex3(x) {
        return x.floor();
      },
      "Complex, number": function ComplexNumber(x, n) {
        return x.floor(n);
      },
      "Complex, BigNumber": function ComplexBigNumber(x, n) {
        return x.floor(n.toNumber());
      },
      BigNumber: function BigNumber2(x) {
        if (nearlyEqual2(x, round3(x), config4.epsilon)) {
          return round3(x);
        } else {
          return x.floor();
        }
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, n) {
        if (nearlyEqual2(x, round3(x, n), config4.epsilon)) {
          return round3(x, n);
        } else {
          return x.toDecimalPlaces(n.toNumber(), decimal_default.ROUND_FLOOR);
        }
      },
      Fraction: function Fraction3(x) {
        return x.floor();
      },
      "Fraction, number": function FractionNumber(x, n) {
        return x.floor(n);
      },
      "Fraction, BigNumber": function FractionBigNumber(x, n) {
        return x.floor(n.toNumber());
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => {
        return deepMap(x, self2, true);
      }),
      "Array, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return deepMap(x, (i3) => self2(i3, n), true);
      }),
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "number | Complex | Fraction | BigNumber, Array": typed3.referToSelf((self2) => (x, y2) => {
        return matAlgo14xDs(matrix2(y2), x, self2, true).valueOf();
      }),
      "number | Complex | Fraction | BigNumber, Matrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0))
          return zeros3(y2.size(), y2.storage());
        if (y2.storage() === "dense") {
          return matAlgo14xDs(y2, x, self2, true);
        }
        return matAlgo12xSfs(y2, x, self2, true);
      })
    });
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo02xDS0.js
  var name46 = "matAlgo02xDS0";
  var dependencies47 = ["typed", "equalScalar"];
  var createMatAlgo02xDS0 = /* @__PURE__ */ factory(name46, dependencies47, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo02xDS0(denseMatrix, sparseMatrix, callback, inverse) {
      var adata = denseMatrix._data;
      var asize = denseMatrix._size;
      var adt = denseMatrix._datatype;
      var bvalues = sparseMatrix._values;
      var bindex = sparseMatrix._index;
      var bptr = sparseMatrix._ptr;
      var bsize = sparseMatrix._size;
      var bdt = sparseMatrix._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      if (!bvalues) {
        throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      for (var j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          var i3 = bindex[k];
          var cij = inverse ? cf(bvalues[k], adata[i3][j]) : cf(adata[i3][j], bvalues[k]);
          if (!eq(cij, zero)) {
            cindex.push(i3);
            cvalues.push(cij);
          }
        }
      }
      cptr[columns] = cindex.length;
      return sparseMatrix.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo03xDSf.js
  var name47 = "matAlgo03xDSf";
  var dependencies48 = ["typed"];
  var createMatAlgo03xDSf = /* @__PURE__ */ factory(name47, dependencies48, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return function matAlgo03xDSf(denseMatrix, sparseMatrix, callback, inverse) {
      var adata = denseMatrix._data;
      var asize = denseMatrix._size;
      var adt = denseMatrix._datatype;
      var bvalues = sparseMatrix._values;
      var bindex = sparseMatrix._index;
      var bptr = sparseMatrix._ptr;
      var bsize = sparseMatrix._size;
      var bdt = sparseMatrix._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      if (!bvalues) {
        throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cdata = [];
      for (var z = 0; z < rows; z++) {
        cdata[z] = [];
      }
      var x = [];
      var w2 = [];
      for (var j = 0; j < columns; j++) {
        var mark = j + 1;
        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          var i3 = bindex[k];
          x[i3] = inverse ? cf(bvalues[k], adata[i3][j]) : cf(adata[i3][j], bvalues[k]);
          w2[i3] = mark;
        }
        for (var y2 = 0; y2 < rows; y2++) {
          if (w2[y2] === mark) {
            cdata[y2][j] = x[y2];
          } else {
            cdata[y2][j] = inverse ? cf(zero, adata[y2][j]) : cf(adata[y2][j], zero);
          }
        }
      }
      return denseMatrix.createDenseMatrix({
        data: cdata,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo05xSfSf.js
  var name48 = "matAlgo05xSfSf";
  var dependencies49 = ["typed", "equalScalar"];
  var createMatAlgo05xSfSf = /* @__PURE__ */ factory(name48, dependencies49, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo05xSfSf(a, b, callback) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = avalues && bvalues ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var xa = cvalues ? [] : void 0;
      var xb = cvalues ? [] : void 0;
      var wa = [];
      var wb = [];
      var i3, j, k, k1;
      for (j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        var mark = j + 1;
        for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
          i3 = aindex[k];
          cindex.push(i3);
          wa[i3] = mark;
          if (xa) {
            xa[i3] = avalues[k];
          }
        }
        for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
          i3 = bindex[k];
          if (wa[i3] !== mark) {
            cindex.push(i3);
          }
          wb[i3] = mark;
          if (xb) {
            xb[i3] = bvalues[k];
          }
        }
        if (cvalues) {
          k = cptr[j];
          while (k < cindex.length) {
            i3 = cindex[k];
            var wai = wa[i3];
            var wbi = wb[i3];
            if (wai === mark || wbi === mark) {
              var va = wai === mark ? xa[i3] : zero;
              var vb = wbi === mark ? xb[i3] : zero;
              var vc = cf(va, vb);
              if (!eq(vc, zero)) {
                cvalues.push(vc);
                k++;
              } else {
                cindex.splice(k, 1);
              }
            }
          }
        }
      }
      cptr[columns] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo13xDD.js
  var name49 = "matAlgo13xDD";
  var dependencies50 = ["typed"];
  var createMatAlgo13xDD = /* @__PURE__ */ factory(name49, dependencies50, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return function matAlgo13xDD(a, b, callback) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var bdata = b._data;
      var bsize = b._size;
      var bdt = b._datatype;
      var csize = [];
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      for (var s = 0; s < asize.length; s++) {
        if (asize[s] !== bsize[s]) {
          throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
        }
        csize[s] = asize[s];
      }
      var dt;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        cf = typed3.find(callback, [dt, dt]);
      }
      var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];
      return a.createDenseMatrix({
        data: cdata,
        size: csize,
        datatype: dt
      });
    };
    function _iterate(f, level, s, n, av, bv) {
      var cv = [];
      if (level === s.length - 1) {
        for (var i3 = 0; i3 < n; i3++) {
          cv[i3] = f(av[i3], bv[i3]);
        }
      } else {
        for (var j = 0; j < n; j++) {
          cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
        }
      }
      return cv;
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/broadcast.js
  var name50 = "broadcast";
  var dependancies = ["concat"];
  var createBroadcast = /* @__PURE__ */ factory(name50, dependancies, (_ref) => {
    var {
      concat: concat3
    } = _ref;
    return function(A2, B2) {
      var N = Math.max(A2._size.length, B2._size.length);
      if (A2._size.length === B2._size.length) {
        if (A2._size.every((dim2, i3) => dim2 === B2._size[i3])) {
          return [A2, B2];
        }
      }
      var sizeA = _padLeft(A2._size, N, 0);
      var sizeB = _padLeft(B2._size, N, 0);
      var sizeMax = [];
      for (var dim = 0; dim < N; dim++) {
        sizeMax[dim] = Math.max(sizeA[dim], sizeB[dim]);
      }
      checkBroadcastingRules(sizeA, sizeMax);
      checkBroadcastingRules(sizeB, sizeMax);
      var AA = A2.clone();
      var BB = B2.clone();
      if (AA._size.length < N) {
        AA.reshape(_padLeft(AA._size, N, 1));
      } else if (BB._size.length < N) {
        BB.reshape(_padLeft(BB._size, N, 1));
      }
      for (var _dim = 0; _dim < N; _dim++) {
        if (AA._size[_dim] < sizeMax[_dim]) {
          AA = _stretch(AA, sizeMax[_dim], _dim);
        }
        if (BB._size[_dim] < sizeMax[_dim]) {
          BB = _stretch(BB, sizeMax[_dim], _dim);
        }
      }
      return [AA, BB];
    };
    function _padLeft(shape, N, filler) {
      return [...Array(N - shape.length).fill(filler), ...shape];
    }
    function _stretch(arrayToStretch, sizeToStretch, dimToStretch) {
      return concat3(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch);
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matrixAlgorithmSuite.js
  var name51 = "matrixAlgorithmSuite";
  var dependencies51 = ["typed", "matrix", "concat"];
  var createMatrixAlgorithmSuite = /* @__PURE__ */ factory(name51, dependencies51, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    } = _ref;
    var matAlgo13xDD = createMatAlgo13xDD({
      typed: typed3
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var broadcast = createBroadcast({
      concat: concat3
    });
    return function matrixAlgorithmSuite(options) {
      var elop = options.elop;
      var SD = options.SD || options.DS;
      var matrixSignatures;
      if (elop) {
        matrixSignatures = {
          "DenseMatrix, DenseMatrix": (x, y2) => matAlgo13xDD(...broadcast(x, y2), elop),
          "Array, Array": (x, y2) => matAlgo13xDD(...broadcast(matrix2(x), matrix2(y2)), elop).valueOf(),
          "Array, DenseMatrix": (x, y2) => matAlgo13xDD(...broadcast(matrix2(x), y2), elop),
          "DenseMatrix, Array": (x, y2) => matAlgo13xDD(...broadcast(x, matrix2(y2)), elop)
        };
        if (options.SS) {
          matrixSignatures["SparseMatrix, SparseMatrix"] = (x, y2) => options.SS(...broadcast(x, y2), elop, false);
        }
        if (options.DS) {
          matrixSignatures["DenseMatrix, SparseMatrix"] = (x, y2) => options.DS(...broadcast(x, y2), elop, false);
          matrixSignatures["Array, SparseMatrix"] = (x, y2) => options.DS(...broadcast(matrix2(x), y2), elop, false);
        }
        if (SD) {
          matrixSignatures["SparseMatrix, DenseMatrix"] = (x, y2) => SD(...broadcast(y2, x), elop, true);
          matrixSignatures["SparseMatrix, Array"] = (x, y2) => SD(...broadcast(matrix2(y2), x), elop, true);
        }
      } else {
        matrixSignatures = {
          "DenseMatrix, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo13xDD(...broadcast(x, y2), self2);
          }),
          "Array, Array": typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo13xDD(...broadcast(matrix2(x), matrix2(y2)), self2).valueOf();
          }),
          "Array, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo13xDD(...broadcast(matrix2(x), y2), self2);
          }),
          "DenseMatrix, Array": typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo13xDD(...broadcast(x, matrix2(y2)), self2);
          })
        };
        if (options.SS) {
          matrixSignatures["SparseMatrix, SparseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return options.SS(...broadcast(x, y2), self2, false);
          });
        }
        if (options.DS) {
          matrixSignatures["DenseMatrix, SparseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return options.DS(...broadcast(x, y2), self2, false);
          });
          matrixSignatures["Array, SparseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return options.DS(...broadcast(matrix2(x), y2), self2, false);
          });
        }
        if (SD) {
          matrixSignatures["SparseMatrix, DenseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return SD(...broadcast(y2, x), self2, true);
          });
          matrixSignatures["SparseMatrix, Array"] = typed3.referToSelf((self2) => (x, y2) => {
            return SD(...broadcast(matrix2(y2), x), self2, true);
          });
        }
      }
      var scalar = options.scalar || "any";
      var Ds = options.Ds || options.Ss;
      if (Ds) {
        if (elop) {
          matrixSignatures["DenseMatrix," + scalar] = (x, y2) => matAlgo14xDs(x, y2, elop, false);
          matrixSignatures[scalar + ", DenseMatrix"] = (x, y2) => matAlgo14xDs(y2, x, elop, true);
          matrixSignatures["Array," + scalar] = (x, y2) => matAlgo14xDs(matrix2(x), y2, elop, false).valueOf();
          matrixSignatures[scalar + ", Array"] = (x, y2) => matAlgo14xDs(matrix2(y2), x, elop, true).valueOf();
        } else {
          matrixSignatures["DenseMatrix," + scalar] = typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo14xDs(x, y2, self2, false);
          });
          matrixSignatures[scalar + ", DenseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo14xDs(y2, x, self2, true);
          });
          matrixSignatures["Array," + scalar] = typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo14xDs(matrix2(x), y2, self2, false).valueOf();
          });
          matrixSignatures[scalar + ", Array"] = typed3.referToSelf((self2) => (x, y2) => {
            return matAlgo14xDs(matrix2(y2), x, self2, true).valueOf();
          });
        }
      }
      var sS = options.sS !== void 0 ? options.sS : options.Ss;
      if (elop) {
        if (options.Ss) {
          matrixSignatures["SparseMatrix," + scalar] = (x, y2) => options.Ss(x, y2, elop, false);
        }
        if (sS) {
          matrixSignatures[scalar + ", SparseMatrix"] = (x, y2) => sS(y2, x, elop, true);
        }
      } else {
        if (options.Ss) {
          matrixSignatures["SparseMatrix," + scalar] = typed3.referToSelf((self2) => (x, y2) => {
            return options.Ss(x, y2, self2, false);
          });
        }
        if (sS) {
          matrixSignatures[scalar + ", SparseMatrix"] = typed3.referToSelf((self2) => (x, y2) => {
            return sS(y2, x, self2, true);
          });
        }
      }
      if (elop && elop.signatures) {
        extend(matrixSignatures, elop.signatures);
      }
      return matrixSignatures;
    };
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/mod.js
  var name52 = "mod";
  var dependencies52 = ["typed", "config", "round", "matrix", "equalScalar", "zeros", "DenseMatrix", "concat"];
  var createMod = /* @__PURE__ */ factory(name52, dependencies52, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      round: round3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var floor3 = createFloor({
      typed: typed3,
      config: config4,
      round: round3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo05xSfSf = createMatAlgo05xSfSf({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name52, {
      "number, number": _modNumber,
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return y2.isZero() ? x : x.sub(y2.mul(floor3(x.div(y2))));
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return y2.equals(0) ? x : x.sub(y2.mul(floor3(x.div(y2))));
      }
    }, matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      SD: matAlgo02xDS0,
      Ss: matAlgo11xS0s,
      sS: matAlgo12xSfs
    }));
    function _modNumber(x, y2) {
      return y2 === 0 ? x : x - y2 * floor3(x / y2);
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo01xDSid.js
  var name53 = "matAlgo01xDSid";
  var dependencies53 = ["typed"];
  var createMatAlgo01xDSid = /* @__PURE__ */ factory(name53, dependencies53, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return function algorithm1(denseMatrix, sparseMatrix, callback, inverse) {
      var adata = denseMatrix._data;
      var asize = denseMatrix._size;
      var adt = denseMatrix._datatype;
      var bvalues = sparseMatrix._values;
      var bindex = sparseMatrix._index;
      var bptr = sparseMatrix._ptr;
      var bsize = sparseMatrix._size;
      var bdt = sparseMatrix._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      if (!bvalues) {
        throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt = typeof adt === "string" && adt === bdt ? adt : void 0;
      var cf = dt ? typed3.find(callback, [dt, dt]) : callback;
      var i3, j;
      var cdata = [];
      for (i3 = 0; i3 < rows; i3++) {
        cdata[i3] = [];
      }
      var x = [];
      var w2 = [];
      for (j = 0; j < columns; j++) {
        var mark = j + 1;
        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          i3 = bindex[k];
          x[i3] = inverse ? cf(bvalues[k], adata[i3][j]) : cf(adata[i3][j], bvalues[k]);
          w2[i3] = mark;
        }
        for (i3 = 0; i3 < rows; i3++) {
          if (w2[i3] === mark) {
            cdata[i3][j] = x[i3];
          } else {
            cdata[i3][j] = adata[i3][j];
          }
        }
      }
      return denseMatrix.createDenseMatrix({
        data: cdata,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo04xSidSid.js
  var name54 = "matAlgo04xSidSid";
  var dependencies54 = ["typed", "equalScalar"];
  var createMatAlgo04xSidSid = /* @__PURE__ */ factory(name54, dependencies54, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo04xSidSid(a, b, callback) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = avalues && bvalues ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var xa = avalues && bvalues ? [] : void 0;
      var xb = avalues && bvalues ? [] : void 0;
      var wa = [];
      var wb = [];
      var i3, j, k, k0, k1;
      for (j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        var mark = j + 1;
        for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          i3 = aindex[k];
          cindex.push(i3);
          wa[i3] = mark;
          if (xa) {
            xa[i3] = avalues[k];
          }
        }
        for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          i3 = bindex[k];
          if (wa[i3] === mark) {
            if (xa) {
              var v = cf(xa[i3], bvalues[k]);
              if (!eq(v, zero)) {
                xa[i3] = v;
              } else {
                wa[i3] = null;
              }
            }
          } else {
            cindex.push(i3);
            wb[i3] = mark;
            if (xb) {
              xb[i3] = bvalues[k];
            }
          }
        }
        if (xa && xb) {
          k = cptr[j];
          while (k < cindex.length) {
            i3 = cindex[k];
            if (wa[i3] === mark) {
              cvalues[k] = xa[i3];
              k++;
            } else if (wb[i3] === mark) {
              cvalues[k] = xb[i3];
              k++;
            } else {
              cindex.splice(k, 1);
            }
          }
        }
      }
      cptr[columns] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo10xSids.js
  var name55 = "matAlgo10xSids";
  var dependencies55 = ["typed", "DenseMatrix"];
  var createMatAlgo10xSids = /* @__PURE__ */ factory(name55, dependencies55, (_ref) => {
    var {
      typed: typed3,
      DenseMatrix: DenseMatrix2
    } = _ref;
    return function matAlgo10xSids(s, b, callback, inverse) {
      var avalues = s._values;
      var aindex = s._index;
      var aptr = s._ptr;
      var asize = s._size;
      var adt = s._datatype;
      if (!avalues) {
        throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var cf = callback;
      if (typeof adt === "string") {
        dt = adt;
        b = typed3.convert(b, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cdata = [];
      var x = [];
      var w2 = [];
      for (var j = 0; j < columns; j++) {
        var mark = j + 1;
        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          var r = aindex[k];
          x[r] = avalues[k];
          w2[r] = mark;
        }
        for (var i3 = 0; i3 < rows; i3++) {
          if (j === 0) {
            cdata[i3] = [];
          }
          if (w2[i3] === mark) {
            cdata[i3][j] = inverse ? cf(b, x[i3]) : cf(x[i3], b);
          } else {
            cdata[i3][j] = b;
          }
        }
      }
      return new DenseMatrix2({
        data: cdata,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/error/ArgumentsError.js
  function ArgumentsError(fn, count2, min3, max3) {
    if (!(this instanceof ArgumentsError)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    this.fn = fn;
    this.count = count2;
    this.min = min3;
    this.max = max3;
    this.message = "Wrong number of arguments in function " + fn + " (" + count2 + " provided, " + min3 + (max3 !== void 0 && max3 !== null ? "-" + max3 : "") + " expected)";
    this.stack = new Error().stack;
  }
  ArgumentsError.prototype = new Error();
  ArgumentsError.prototype.constructor = Error;
  ArgumentsError.prototype.name = "ArgumentsError";
  ArgumentsError.prototype.isArgumentsError = true;

  // node_modules/mathjs/lib/esm/function/arithmetic/gcd.js
  var name56 = "gcd";
  var dependencies56 = ["typed", "config", "round", "matrix", "equalScalar", "zeros", "BigNumber", "DenseMatrix", "concat"];
  var gcdTypes = "number | BigNumber | Fraction | Matrix | Array";
  var gcdManyTypesSignature = "".concat(gcdTypes, ", ").concat(gcdTypes, ", ...").concat(gcdTypes);
  function is1d(array) {
    return !array.some((element) => Array.isArray(element));
  }
  var createGcd = /* @__PURE__ */ factory(name56, dependencies56, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      config: config4,
      round: round3,
      equalScalar: equalScalar2,
      zeros: zeros3,
      BigNumber: BigNumber2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var mod3 = createMod({
      typed: typed3,
      config: config4,
      round: round3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    });
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo04xSidSid = createMatAlgo04xSidSid({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name56, {
      "number, number": _gcdNumber,
      "BigNumber, BigNumber": _gcdBigNumber,
      "Fraction, Fraction": (x, y2) => x.gcd(y2)
    }, matrixAlgorithmSuite({
      SS: matAlgo04xSidSid,
      DS: matAlgo01xDSid,
      Ss: matAlgo10xSids
    }), {
      [gcdManyTypesSignature]: typed3.referToSelf((self2) => (a, b, args) => {
        var res = self2(a, b);
        for (var i3 = 0; i3 < args.length; i3++) {
          res = self2(res, args[i3]);
        }
        return res;
      }),
      Array: typed3.referToSelf((self2) => (array) => {
        if (array.length === 1 && Array.isArray(array[0]) && is1d(array[0])) {
          return self2(...array[0]);
        }
        if (is1d(array)) {
          return self2(...array);
        }
        throw new ArgumentsError("gcd() supports only 1d matrices!");
      }),
      Matrix: typed3.referToSelf((self2) => (matrix3) => {
        return self2(matrix3.toArray());
      })
    });
    function _gcdNumber(a, b) {
      if (!isInteger(a) || !isInteger(b)) {
        throw new Error("Parameters in function gcd must be integer numbers");
      }
      var r;
      while (b !== 0) {
        r = mod3(a, b);
        a = b;
        b = r;
      }
      return a < 0 ? -a : a;
    }
    function _gcdBigNumber(a, b) {
      if (!a.isInt() || !b.isInt()) {
        throw new Error("Parameters in function gcd must be integer numbers");
      }
      var zero = new BigNumber2(0);
      while (!b.isZero()) {
        var r = mod3(a, b);
        a = b;
        b = r;
      }
      return a.lt(zero) ? a.neg() : a;
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo06xS0S0.js
  var name57 = "matAlgo06xS0S0";
  var dependencies57 = ["typed", "equalScalar"];
  var createMatAlgo06xS0S0 = /* @__PURE__ */ factory(name57, dependencies57, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo06xS0S0(a, b, callback) {
      var avalues = a._values;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = avalues && bvalues ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var x = cvalues ? [] : void 0;
      var w2 = [];
      var u = [];
      for (var j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        var mark = j + 1;
        scatter(a, j, w2, x, u, mark, cindex, cf);
        scatter(b, j, w2, x, u, mark, cindex, cf);
        if (x) {
          var k = cptr[j];
          while (k < cindex.length) {
            var i3 = cindex[k];
            if (u[i3] === mark) {
              var v = x[i3];
              if (!eq(v, zero)) {
                cvalues.push(v);
                k++;
              } else {
                cindex.splice(k, 1);
              }
            } else {
              cindex.splice(k, 1);
            }
          }
        } else {
          var p = cptr[j];
          while (p < cindex.length) {
            var r = cindex[p];
            if (u[r] !== mark) {
              cindex.splice(p, 1);
            } else {
              p++;
            }
          }
        }
      }
      cptr[columns] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/lcm.js
  var name58 = "lcm";
  var dependencies58 = ["typed", "matrix", "equalScalar", "concat"];
  var createLcm = /* @__PURE__ */ factory(name58, dependencies58, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      concat: concat3
    } = _ref;
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo06xS0S0 = createMatAlgo06xS0S0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var lcmTypes = "number | BigNumber | Fraction | Matrix | Array";
    var lcmManySignature = {};
    lcmManySignature["".concat(lcmTypes, ", ").concat(lcmTypes, ", ...").concat(lcmTypes)] = typed3.referToSelf((self2) => (a, b, args) => {
      var res = self2(a, b);
      for (var i3 = 0; i3 < args.length; i3++) {
        res = self2(res, args[i3]);
      }
      return res;
    });
    return typed3(name58, {
      "number, number": lcmNumber,
      "BigNumber, BigNumber": _lcmBigNumber,
      "Fraction, Fraction": (x, y2) => x.lcm(y2)
    }, matrixAlgorithmSuite({
      SS: matAlgo06xS0S0,
      DS: matAlgo02xDS0,
      Ss: matAlgo11xS0s
    }), lcmManySignature);
    function _lcmBigNumber(a, b) {
      if (!a.isInt() || !b.isInt()) {
        throw new Error("Parameters in function lcm must be integer numbers");
      }
      if (a.isZero()) {
        return a;
      }
      if (b.isZero()) {
        return b;
      }
      var prod2 = a.times(b);
      while (!b.isZero()) {
        var t = b;
        b = a.mod(t);
        a = t;
      }
      return prod2.div(a).abs();
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/log10.js
  var name59 = "log10";
  var dependencies59 = ["typed", "config", "Complex"];
  var createLog10 = /* @__PURE__ */ factory(name59, dependencies59, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      Complex: _Complex
    } = _ref;
    return typed3(name59, {
      number: function number2(x) {
        if (x >= 0 || config4.predictable) {
          return log10Number(x);
        } else {
          return new _Complex(x, 0).log().div(Math.LN10);
        }
      },
      Complex: function Complex3(x) {
        return new _Complex(x).log().div(Math.LN10);
      },
      BigNumber: function BigNumber2(x) {
        if (!x.isNegative() || config4.predictable) {
          return x.log();
        } else {
          return new _Complex(x.toNumber(), 0).log().div(Math.LN10);
        }
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/log2.js
  var name60 = "log2";
  var dependencies60 = ["typed", "config", "Complex"];
  var createLog2 = /* @__PURE__ */ factory(name60, dependencies60, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      Complex: Complex3
    } = _ref;
    return typed3(name60, {
      number: function number2(x) {
        if (x >= 0 || config4.predictable) {
          return log2Number(x);
        } else {
          return _log2Complex(new Complex3(x, 0));
        }
      },
      Complex: _log2Complex,
      BigNumber: function BigNumber2(x) {
        if (!x.isNegative() || config4.predictable) {
          return x.log(2);
        } else {
          return _log2Complex(new Complex3(x.toNumber(), 0));
        }
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
    function _log2Complex(x) {
      var newX = Math.sqrt(x.re * x.re + x.im * x.im);
      return new Complex3(Math.log2 ? Math.log2(newX) : Math.log(newX) / Math.LN2, Math.atan2(x.im, x.re) / Math.LN2);
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/multiplyScalar.js
  var name61 = "multiplyScalar";
  var dependencies61 = ["typed"];
  var createMultiplyScalar = /* @__PURE__ */ factory(name61, dependencies61, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3("multiplyScalar", {
      "number, number": multiplyNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.mul(y2);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.times(y2);
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return x.mul(y2);
      },
      "number | Fraction | BigNumber | Complex, Unit": (x, y2) => y2.multiply(x),
      "Unit, number | Fraction | BigNumber | Complex | Unit": (x, y2) => x.multiply(y2)
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/multiply.js
  var name62 = "multiply";
  var dependencies62 = ["typed", "matrix", "addScalar", "multiplyScalar", "equalScalar", "dot"];
  var createMultiply = /* @__PURE__ */ factory(name62, dependencies62, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      addScalar: addScalar2,
      multiplyScalar: multiplyScalar2,
      equalScalar: equalScalar2,
      dot: dot2
    } = _ref;
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    function _validateMatrixDimensions(size1, size2) {
      switch (size1.length) {
        case 1:
          switch (size2.length) {
            case 1:
              if (size1[0] !== size2[0]) {
                throw new RangeError("Dimension mismatch in multiplication. Vectors must have the same length");
              }
              break;
            case 2:
              if (size1[0] !== size2[0]) {
                throw new RangeError("Dimension mismatch in multiplication. Vector length (" + size1[0] + ") must match Matrix rows (" + size2[0] + ")");
              }
              break;
            default:
              throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
          }
          break;
        case 2:
          switch (size2.length) {
            case 1:
              if (size1[1] !== size2[0]) {
                throw new RangeError("Dimension mismatch in multiplication. Matrix columns (" + size1[1] + ") must match Vector length (" + size2[0] + ")");
              }
              break;
            case 2:
              if (size1[1] !== size2[0]) {
                throw new RangeError("Dimension mismatch in multiplication. Matrix A columns (" + size1[1] + ") must match Matrix B rows (" + size2[0] + ")");
              }
              break;
            default:
              throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
          }
          break;
        default:
          throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix A has " + size1.length + " dimensions)");
      }
    }
    function _multiplyVectorVector(a, b, n) {
      if (n === 0) {
        throw new Error("Cannot multiply two empty vectors");
      }
      return dot2(a, b);
    }
    function _multiplyVectorMatrix(a, b) {
      if (b.storage() !== "dense") {
        throw new Error("Support for SparseMatrix not implemented");
      }
      return _multiplyVectorDenseMatrix(a, b);
    }
    function _multiplyVectorDenseMatrix(a, b) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var bdata = b._data;
      var bsize = b._size;
      var bdt = b._datatype;
      var alength = asize[0];
      var bcolumns = bsize[1];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
      }
      var c = [];
      for (var j = 0; j < bcolumns; j++) {
        var sum3 = mf(adata[0], bdata[0][j]);
        for (var i3 = 1; i3 < alength; i3++) {
          sum3 = af(sum3, mf(adata[i3], bdata[i3][j]));
        }
        c[j] = sum3;
      }
      return a.createDenseMatrix({
        data: c,
        size: [bcolumns],
        datatype: dt
      });
    }
    var _multiplyMatrixVector = typed3("_multiplyMatrixVector", {
      "DenseMatrix, any": _multiplyDenseMatrixVector,
      "SparseMatrix, any": _multiplySparseMatrixVector
    });
    var _multiplyMatrixMatrix = typed3("_multiplyMatrixMatrix", {
      "DenseMatrix, DenseMatrix": _multiplyDenseMatrixDenseMatrix,
      "DenseMatrix, SparseMatrix": _multiplyDenseMatrixSparseMatrix,
      "SparseMatrix, DenseMatrix": _multiplySparseMatrixDenseMatrix,
      "SparseMatrix, SparseMatrix": _multiplySparseMatrixSparseMatrix
    });
    function _multiplyDenseMatrixVector(a, b) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var bdata = b._data;
      var bdt = b._datatype;
      var arows = asize[0];
      var acolumns = asize[1];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
      }
      var c = [];
      for (var i3 = 0; i3 < arows; i3++) {
        var row2 = adata[i3];
        var sum3 = mf(row2[0], bdata[0]);
        for (var j = 1; j < acolumns; j++) {
          sum3 = af(sum3, mf(row2[j], bdata[j]));
        }
        c[i3] = sum3;
      }
      return a.createDenseMatrix({
        data: c,
        size: [arows],
        datatype: dt
      });
    }
    function _multiplyDenseMatrixDenseMatrix(a, b) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var bdata = b._data;
      var bsize = b._size;
      var bdt = b._datatype;
      var arows = asize[0];
      var acolumns = asize[1];
      var bcolumns = bsize[1];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
      }
      var c = [];
      for (var i3 = 0; i3 < arows; i3++) {
        var row2 = adata[i3];
        c[i3] = [];
        for (var j = 0; j < bcolumns; j++) {
          var sum3 = mf(row2[0], bdata[0][j]);
          for (var x = 1; x < acolumns; x++) {
            sum3 = af(sum3, mf(row2[x], bdata[x][j]));
          }
          c[i3][j] = sum3;
        }
      }
      return a.createDenseMatrix({
        data: c,
        size: [arows, bcolumns],
        datatype: dt
      });
    }
    function _multiplyDenseMatrixSparseMatrix(a, b) {
      var adata = a._data;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bsize = b._size;
      var bdt = b._datatype;
      if (!bvalues) {
        throw new Error("Cannot multiply Dense Matrix times Pattern only Matrix");
      }
      var arows = asize[0];
      var bcolumns = bsize[1];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      var eq = equalScalar2;
      var zero = 0;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
      }
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      var c = b.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [arows, bcolumns],
        datatype: dt
      });
      for (var jb = 0; jb < bcolumns; jb++) {
        cptr[jb] = cindex.length;
        var kb0 = bptr[jb];
        var kb1 = bptr[jb + 1];
        if (kb1 > kb0) {
          var last = 0;
          for (var i3 = 0; i3 < arows; i3++) {
            var mark = i3 + 1;
            var cij = void 0;
            for (var kb = kb0; kb < kb1; kb++) {
              var ib = bindex[kb];
              if (last !== mark) {
                cij = mf(adata[i3][ib], bvalues[kb]);
                last = mark;
              } else {
                cij = af(cij, mf(adata[i3][ib], bvalues[kb]));
              }
            }
            if (last === mark && !eq(cij, zero)) {
              cindex.push(i3);
              cvalues.push(cij);
            }
          }
        }
      }
      cptr[bcolumns] = cindex.length;
      return c;
    }
    function _multiplySparseMatrixVector(a, b) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var adt = a._datatype;
      if (!avalues) {
        throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
      }
      var bdata = b._data;
      var bdt = b._datatype;
      var arows = a._size[0];
      var brows = b._size[0];
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      var eq = equalScalar2;
      var zero = 0;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
      }
      var x = [];
      var w2 = [];
      cptr[0] = 0;
      for (var ib = 0; ib < brows; ib++) {
        var vbi = bdata[ib];
        if (!eq(vbi, zero)) {
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            var ia = aindex[ka];
            if (!w2[ia]) {
              w2[ia] = true;
              cindex.push(ia);
              x[ia] = mf(vbi, avalues[ka]);
            } else {
              x[ia] = af(x[ia], mf(vbi, avalues[ka]));
            }
          }
        }
      }
      for (var p1 = cindex.length, p = 0; p < p1; p++) {
        var ic = cindex[p];
        cvalues[p] = x[ic];
      }
      cptr[1] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [arows, 1],
        datatype: dt
      });
    }
    function _multiplySparseMatrixDenseMatrix(a, b) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var adt = a._datatype;
      if (!avalues) {
        throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
      }
      var bdata = b._data;
      var bdt = b._datatype;
      var arows = a._size[0];
      var brows = b._size[0];
      var bcolumns = b._size[1];
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      var eq = equalScalar2;
      var zero = 0;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
      }
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      var c = a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [arows, bcolumns],
        datatype: dt
      });
      var x = [];
      var w2 = [];
      for (var jb = 0; jb < bcolumns; jb++) {
        cptr[jb] = cindex.length;
        var mark = jb + 1;
        for (var ib = 0; ib < brows; ib++) {
          var vbij = bdata[ib][jb];
          if (!eq(vbij, zero)) {
            for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
              var ia = aindex[ka];
              if (w2[ia] !== mark) {
                w2[ia] = mark;
                cindex.push(ia);
                x[ia] = mf(vbij, avalues[ka]);
              } else {
                x[ia] = af(x[ia], mf(vbij, avalues[ka]));
              }
            }
          }
        }
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          var ic = cindex[p];
          cvalues[p] = x[ic];
        }
      }
      cptr[bcolumns] = cindex.length;
      return c;
    }
    function _multiplySparseMatrixSparseMatrix(a, b) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bdt = b._datatype;
      var arows = a._size[0];
      var bcolumns = b._size[1];
      var values = avalues && bvalues;
      var dt;
      var af = addScalar2;
      var mf = multiplyScalar2;
      if (adt && bdt && adt === bdt && typeof adt === "string") {
        dt = adt;
        af = typed3.find(addScalar2, [dt, dt]);
        mf = typed3.find(multiplyScalar2, [dt, dt]);
      }
      var cvalues = values ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var c = a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [arows, bcolumns],
        datatype: dt
      });
      var x = values ? [] : void 0;
      var w2 = [];
      var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
      for (var jb = 0; jb < bcolumns; jb++) {
        cptr[jb] = cindex.length;
        var mark = jb + 1;
        for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
          ib = bindex[kb];
          if (values) {
            for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
              ia = aindex[ka];
              if (w2[ia] !== mark) {
                w2[ia] = mark;
                cindex.push(ia);
                x[ia] = mf(bvalues[kb], avalues[ka]);
              } else {
                x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
              }
            }
          } else {
            for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
              ia = aindex[ka];
              if (w2[ia] !== mark) {
                w2[ia] = mark;
                cindex.push(ia);
              }
            }
          }
        }
        if (values) {
          for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
            var ic = cindex[p];
            cvalues[p] = x[ic];
          }
        }
      }
      cptr[bcolumns] = cindex.length;
      return c;
    }
    return typed3(name62, multiplyScalar2, {
      // we extend the signatures of multiplyScalar with signatures dealing with matrices
      "Array, Array": typed3.referTo("Matrix, Matrix", (selfMM) => (x, y2) => {
        _validateMatrixDimensions(arraySize(x), arraySize(y2));
        var m = selfMM(matrix2(x), matrix2(y2));
        return isMatrix(m) ? m.valueOf() : m;
      }),
      "Matrix, Matrix": function MatrixMatrix(x, y2) {
        var xsize = x.size();
        var ysize = y2.size();
        _validateMatrixDimensions(xsize, ysize);
        if (xsize.length === 1) {
          if (ysize.length === 1) {
            return _multiplyVectorVector(x, y2, xsize[0]);
          }
          return _multiplyVectorMatrix(x, y2);
        }
        if (ysize.length === 1) {
          return _multiplyMatrixVector(x, y2);
        }
        return _multiplyMatrixMatrix(x, y2);
      },
      "Matrix, Array": typed3.referTo("Matrix,Matrix", (selfMM) => (x, y2) => selfMM(x, matrix2(y2))),
      "Array, Matrix": typed3.referToSelf((self2) => (x, y2) => {
        return self2(matrix2(x, y2.storage()), y2);
      }),
      "SparseMatrix, any": function SparseMatrixAny(x, y2) {
        return matAlgo11xS0s(x, y2, multiplyScalar2, false);
      },
      "DenseMatrix, any": function DenseMatrixAny(x, y2) {
        return matAlgo14xDs(x, y2, multiplyScalar2, false);
      },
      "any, SparseMatrix": function anySparseMatrix(x, y2) {
        return matAlgo11xS0s(y2, x, multiplyScalar2, true);
      },
      "any, DenseMatrix": function anyDenseMatrix(x, y2) {
        return matAlgo14xDs(y2, x, multiplyScalar2, true);
      },
      "Array, any": function ArrayAny(x, y2) {
        return matAlgo14xDs(matrix2(x), y2, multiplyScalar2, false).valueOf();
      },
      "any, Array": function anyArray(x, y2) {
        return matAlgo14xDs(matrix2(y2), x, multiplyScalar2, true).valueOf();
      },
      "any, any": multiplyScalar2,
      "any, any, ...any": typed3.referToSelf((self2) => (x, y2, rest) => {
        var result = self2(x, y2);
        for (var i3 = 0; i3 < rest.length; i3++) {
          result = self2(result, rest[i3]);
        }
        return result;
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/nthRoot.js
  var name63 = "nthRoot";
  var dependencies63 = ["typed", "matrix", "equalScalar", "BigNumber", "concat"];
  var createNthRoot = /* @__PURE__ */ factory(name63, dependencies63, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      BigNumber: _BigNumber,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo06xS0S0 = createMatAlgo06xS0S0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    function complexErr() {
      throw new Error("Complex number not supported in function nthRoot. Use nthRoots instead.");
    }
    return typed3(name63, {
      number: nthRootNumber,
      "number, number": nthRootNumber,
      BigNumber: (x) => _bigNthRoot(x, new _BigNumber(2)),
      "BigNumber, BigNumber": _bigNthRoot,
      Complex: complexErr,
      "Complex, number": complexErr,
      Array: typed3.referTo("DenseMatrix,number", (selfDn) => (x) => selfDn(matrix2(x), 2).valueOf()),
      DenseMatrix: typed3.referTo("DenseMatrix,number", (selfDn) => (x) => selfDn(x, 2)),
      SparseMatrix: typed3.referTo("SparseMatrix,number", (selfSn) => (x) => selfSn(x, 2)),
      "SparseMatrix, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (y2.density() === 1) {
          return matAlgo06xS0S0(x, y2, self2);
        } else {
          throw new Error("Root must be non-zero");
        }
      }),
      "DenseMatrix, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (y2.density() === 1) {
          return matAlgo01xDSid(x, y2, self2, false);
        } else {
          throw new Error("Root must be non-zero");
        }
      }),
      "Array, SparseMatrix": typed3.referTo("DenseMatrix,SparseMatrix", (selfDS) => (x, y2) => selfDS(matrix2(x), y2)),
      "number | BigNumber, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (y2.density() === 1) {
          return matAlgo11xS0s(y2, x, self2, true);
        } else {
          throw new Error("Root must be non-zero");
        }
      })
    }, matrixAlgorithmSuite({
      scalar: "number | BigNumber",
      SD: matAlgo02xDS0,
      Ss: matAlgo11xS0s,
      sS: false
    }));
    function _bigNthRoot(a, root) {
      var precision = _BigNumber.precision;
      var Big = _BigNumber.clone({
        precision: precision + 2
      });
      var zero = new _BigNumber(0);
      var one = new Big(1);
      var inv2 = root.isNegative();
      if (inv2) {
        root = root.neg();
      }
      if (root.isZero()) {
        throw new Error("Root must be non-zero");
      }
      if (a.isNegative() && !root.abs().mod(2).equals(1)) {
        throw new Error("Root must be odd when a is negative.");
      }
      if (a.isZero()) {
        return inv2 ? new Big(Infinity) : 0;
      }
      if (!a.isFinite()) {
        return inv2 ? zero : a;
      }
      var x = a.abs().pow(one.div(root));
      x = a.isNeg() ? x.neg() : x;
      return new _BigNumber((inv2 ? one.div(x) : x).toPrecision(precision));
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/sign.js
  var name64 = "sign";
  var dependencies64 = ["typed", "BigNumber", "Fraction", "complex"];
  var createSign = /* @__PURE__ */ factory(name64, dependencies64, (_ref) => {
    var {
      typed: typed3,
      BigNumber: _BigNumber,
      complex: complex2,
      Fraction: _Fraction
    } = _ref;
    return typed3(name64, {
      number: signNumber,
      Complex: function Complex3(x) {
        return x.im === 0 ? complex2(signNumber(x.re)) : x.sign();
      },
      BigNumber: function BigNumber2(x) {
        return new _BigNumber(x.cmp(0));
      },
      Fraction: function Fraction3(x) {
        return new _Fraction(x.s, 1);
      },
      // deep map collection, skip zeros since sign(0) = 0
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2, true)),
      Unit: typed3.referToSelf((self2) => (x) => {
        if (!x._isDerived() && x.units[0].unit.offset !== 0) {
          throw new TypeError("sign is ambiguous for units with offset");
        }
        return typed3.find(self2, x.valueType())(x.value);
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/sqrt.js
  var name65 = "sqrt";
  var dependencies65 = ["config", "typed", "Complex"];
  var createSqrt = /* @__PURE__ */ factory(name65, dependencies65, (_ref) => {
    var {
      config: config4,
      typed: typed3,
      Complex: Complex3
    } = _ref;
    return typed3("sqrt", {
      number: _sqrtNumber,
      Complex: function Complex4(x) {
        return x.sqrt();
      },
      BigNumber: function BigNumber2(x) {
        if (!x.isNegative() || config4.predictable) {
          return x.sqrt();
        } else {
          return _sqrtNumber(x.toNumber());
        }
      },
      Unit: function Unit2(x) {
        return x.pow(0.5);
      }
    });
    function _sqrtNumber(x) {
      if (isNaN(x)) {
        return NaN;
      } else if (x >= 0 || config4.predictable) {
        return Math.sqrt(x);
      } else {
        return new Complex3(x, 0).sqrt();
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/square.js
  var name66 = "square";
  var dependencies66 = ["typed"];
  var createSquare = /* @__PURE__ */ factory(name66, dependencies66, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name66, {
      number: squareNumber,
      Complex: function Complex3(x) {
        return x.mul(x);
      },
      BigNumber: function BigNumber2(x) {
        return x.times(x);
      },
      Fraction: function Fraction3(x) {
        return x.mul(x);
      },
      Unit: function Unit2(x) {
        return x.pow(2);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/subtract.js
  var name67 = "subtract";
  var dependencies67 = ["typed", "matrix", "equalScalar", "subtractScalar", "unaryMinus", "DenseMatrix", "concat"];
  var createSubtract = /* @__PURE__ */ factory(name67, dependencies67, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      subtractScalar: subtractScalar2,
      unaryMinus: unaryMinus2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo05xSfSf = createMatAlgo05xSfSf({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name67, {
      "any, any": subtractScalar2
    }, matrixAlgorithmSuite({
      elop: subtractScalar2,
      SS: matAlgo05xSfSf,
      DS: matAlgo01xDSid,
      SD: matAlgo03xDSf,
      Ss: matAlgo12xSfs,
      sS: matAlgo10xSids
    }));
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/xgcd.js
  var name68 = "xgcd";
  var dependencies68 = ["typed", "config", "matrix", "BigNumber"];
  var createXgcd = /* @__PURE__ */ factory(name68, dependencies68, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      BigNumber: BigNumber2
    } = _ref;
    return typed3(name68, {
      "number, number": function numberNumber(a, b) {
        var res = xgcdNumber(a, b);
        return config4.matrix === "Array" ? res : matrix2(res);
      },
      "BigNumber, BigNumber": _xgcdBigNumber
      // TODO: implement support for Fraction
    });
    function _xgcdBigNumber(a, b) {
      var t;
      var q;
      var r;
      var zero = new BigNumber2(0);
      var one = new BigNumber2(1);
      var x = zero;
      var lastx = one;
      var y2 = one;
      var lasty = zero;
      if (!a.isInt() || !b.isInt()) {
        throw new Error("Parameters in function xgcd must be integer numbers");
      }
      while (!b.isZero()) {
        q = a.div(b).floor();
        r = a.mod(b);
        t = x;
        x = lastx.minus(q.times(x));
        lastx = t;
        t = y2;
        y2 = lasty.minus(q.times(y2));
        lasty = t;
        a = b;
        b = r;
      }
      var res;
      if (a.lt(zero)) {
        res = [a.neg(), lastx.neg(), lasty.neg()];
      } else {
        res = [a, !a.isZero() ? lastx : 0, lasty];
      }
      return config4.matrix === "Array" ? res : matrix2(res);
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/invmod.js
  var name69 = "invmod";
  var dependencies69 = ["typed", "config", "BigNumber", "xgcd", "equal", "smaller", "mod", "add", "isInteger"];
  var createInvmod = /* @__PURE__ */ factory(name69, dependencies69, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      BigNumber: BigNumber2,
      xgcd: xgcd2,
      equal: equal2,
      smaller: smaller2,
      mod: mod3,
      add: add3,
      isInteger: isInteger3
    } = _ref;
    return typed3(name69, {
      "number, number": invmod2,
      "BigNumber, BigNumber": invmod2
    });
    function invmod2(a, b) {
      if (!isInteger3(a) || !isInteger3(b))
        throw new Error("Parameters in function invmod must be integer numbers");
      a = mod3(a, b);
      if (equal2(b, 0))
        throw new Error("Divisor must be non zero");
      var res = xgcd2(a, b);
      res = res.valueOf();
      var [gcd2, inv2] = res;
      if (!equal2(gcd2, BigNumber2(1)))
        return NaN;
      inv2 = mod3(inv2, b);
      if (smaller2(inv2, BigNumber2(0)))
        inv2 = add3(inv2, b);
      return inv2;
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo09xS0Sf.js
  var name70 = "matAlgo09xS0Sf";
  var dependencies70 = ["typed", "equalScalar"];
  var createMatAlgo09xS0Sf = /* @__PURE__ */ factory(name70, dependencies70, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo09xS0Sf(a, b, callback) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = avalues && bvalues ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var x = cvalues ? [] : void 0;
      var w2 = [];
      var i3, j, k, k0, k1;
      for (j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        var mark = j + 1;
        if (x) {
          for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
            i3 = bindex[k];
            w2[i3] = mark;
            x[i3] = bvalues[k];
          }
        }
        for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          i3 = aindex[k];
          if (x) {
            var vb = w2[i3] === mark ? x[i3] : zero;
            var vc = cf(avalues[k], vb);
            if (!eq(vc, zero)) {
              cindex.push(i3);
              cvalues.push(vc);
            }
          } else {
            cindex.push(i3);
          }
        }
      }
      cptr[columns] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/dotMultiply.js
  var name71 = "dotMultiply";
  var dependencies71 = ["typed", "matrix", "equalScalar", "multiplyScalar", "concat"];
  var createDotMultiply = /* @__PURE__ */ factory(name71, dependencies71, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      multiplyScalar: multiplyScalar2,
      concat: concat3
    } = _ref;
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo09xS0Sf = createMatAlgo09xS0Sf({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name71, matrixAlgorithmSuite({
      elop: multiplyScalar2,
      SS: matAlgo09xS0Sf,
      DS: matAlgo02xDS0,
      Ss: matAlgo11xS0s
    }));
  });

  // node_modules/mathjs/lib/esm/utils/bignumber/bitwise.js
  function bitAndBigNumber(x, y2) {
    if (x.isFinite() && !x.isInteger() || y2.isFinite() && !y2.isInteger()) {
      throw new Error("Integers expected in function bitAnd");
    }
    var BigNumber2 = x.constructor;
    if (x.isNaN() || y2.isNaN()) {
      return new BigNumber2(NaN);
    }
    if (x.isZero() || y2.eq(-1) || x.eq(y2)) {
      return x;
    }
    if (y2.isZero() || x.eq(-1)) {
      return y2;
    }
    if (!x.isFinite() || !y2.isFinite()) {
      if (!x.isFinite() && !y2.isFinite()) {
        if (x.isNegative() === y2.isNegative()) {
          return x;
        }
        return new BigNumber2(0);
      }
      if (!x.isFinite()) {
        if (y2.isNegative()) {
          return x;
        }
        if (x.isNegative()) {
          return new BigNumber2(0);
        }
        return y2;
      }
      if (!y2.isFinite()) {
        if (x.isNegative()) {
          return y2;
        }
        if (y2.isNegative()) {
          return new BigNumber2(0);
        }
        return x;
      }
    }
    return bitwise(x, y2, function(a, b) {
      return a & b;
    });
  }
  function bitNotBigNumber(x) {
    if (x.isFinite() && !x.isInteger()) {
      throw new Error("Integer expected in function bitNot");
    }
    var BigNumber2 = x.constructor;
    var prevPrec = BigNumber2.precision;
    BigNumber2.config({
      precision: 1e9
    });
    var result = x.plus(new BigNumber2(1));
    result.s = -result.s || null;
    BigNumber2.config({
      precision: prevPrec
    });
    return result;
  }
  function bitOrBigNumber(x, y2) {
    if (x.isFinite() && !x.isInteger() || y2.isFinite() && !y2.isInteger()) {
      throw new Error("Integers expected in function bitOr");
    }
    var BigNumber2 = x.constructor;
    if (x.isNaN() || y2.isNaN()) {
      return new BigNumber2(NaN);
    }
    var negOne = new BigNumber2(-1);
    if (x.isZero() || y2.eq(negOne) || x.eq(y2)) {
      return y2;
    }
    if (y2.isZero() || x.eq(negOne)) {
      return x;
    }
    if (!x.isFinite() || !y2.isFinite()) {
      if (!x.isFinite() && !x.isNegative() && y2.isNegative() || x.isNegative() && !y2.isNegative() && !y2.isFinite()) {
        return negOne;
      }
      if (x.isNegative() && y2.isNegative()) {
        return x.isFinite() ? x : y2;
      }
      return x.isFinite() ? y2 : x;
    }
    return bitwise(x, y2, function(a, b) {
      return a | b;
    });
  }
  function bitwise(x, y2, func) {
    var BigNumber2 = x.constructor;
    var xBits, yBits;
    var xSign = +(x.s < 0);
    var ySign = +(y2.s < 0);
    if (xSign) {
      xBits = decCoefficientToBinaryString(bitNotBigNumber(x));
      for (var i3 = 0; i3 < xBits.length; ++i3) {
        xBits[i3] ^= 1;
      }
    } else {
      xBits = decCoefficientToBinaryString(x);
    }
    if (ySign) {
      yBits = decCoefficientToBinaryString(bitNotBigNumber(y2));
      for (var _i = 0; _i < yBits.length; ++_i) {
        yBits[_i] ^= 1;
      }
    } else {
      yBits = decCoefficientToBinaryString(y2);
    }
    var minBits, maxBits, minSign;
    if (xBits.length <= yBits.length) {
      minBits = xBits;
      maxBits = yBits;
      minSign = xSign;
    } else {
      minBits = yBits;
      maxBits = xBits;
      minSign = ySign;
    }
    var shortLen = minBits.length;
    var longLen = maxBits.length;
    var expFuncVal = func(xSign, ySign) ^ 1;
    var outVal = new BigNumber2(expFuncVal ^ 1);
    var twoPower = new BigNumber2(1);
    var two = new BigNumber2(2);
    var prevPrec = BigNumber2.precision;
    BigNumber2.config({
      precision: 1e9
    });
    while (shortLen > 0) {
      if (func(minBits[--shortLen], maxBits[--longLen]) === expFuncVal) {
        outVal = outVal.plus(twoPower);
      }
      twoPower = twoPower.times(two);
    }
    while (longLen > 0) {
      if (func(minSign, maxBits[--longLen]) === expFuncVal) {
        outVal = outVal.plus(twoPower);
      }
      twoPower = twoPower.times(two);
    }
    BigNumber2.config({
      precision: prevPrec
    });
    if (expFuncVal === 0) {
      outVal.s = -outVal.s;
    }
    return outVal;
  }
  function decCoefficientToBinaryString(x) {
    var a = x.d;
    var r = a[0] + "";
    for (var i3 = 1; i3 < a.length; ++i3) {
      var s = a[i3] + "";
      for (var z = 7 - s.length; z--; ) {
        s = "0" + s;
      }
      r += s;
    }
    var j = r.length;
    while (r.charAt(j) === "0") {
      j--;
    }
    var xe = x.e;
    var str = r.slice(0, j + 1 || 1);
    var strL = str.length;
    if (xe > 0) {
      if (++xe > strL) {
        xe -= strL;
        while (xe--) {
          str += "0";
        }
      } else if (xe < strL) {
        str = str.slice(0, xe) + "." + str.slice(xe);
      }
    }
    var arr = [0];
    for (var _i2 = 0; _i2 < str.length; ) {
      var arrL = arr.length;
      while (arrL--) {
        arr[arrL] *= 10;
      }
      arr[0] += parseInt(str.charAt(_i2++));
      for (var _j = 0; _j < arr.length; ++_j) {
        if (arr[_j] > 1) {
          if (arr[_j + 1] === null || arr[_j + 1] === void 0) {
            arr[_j + 1] = 0;
          }
          arr[_j + 1] += arr[_j] >> 1;
          arr[_j] &= 1;
        }
      }
    }
    return arr.reverse();
  }
  function bitXor(x, y2) {
    if (x.isFinite() && !x.isInteger() || y2.isFinite() && !y2.isInteger()) {
      throw new Error("Integers expected in function bitXor");
    }
    var BigNumber2 = x.constructor;
    if (x.isNaN() || y2.isNaN()) {
      return new BigNumber2(NaN);
    }
    if (x.isZero()) {
      return y2;
    }
    if (y2.isZero()) {
      return x;
    }
    if (x.eq(y2)) {
      return new BigNumber2(0);
    }
    var negOne = new BigNumber2(-1);
    if (x.eq(negOne)) {
      return bitNotBigNumber(y2);
    }
    if (y2.eq(negOne)) {
      return bitNotBigNumber(x);
    }
    if (!x.isFinite() || !y2.isFinite()) {
      if (!x.isFinite() && !y2.isFinite()) {
        return negOne;
      }
      return new BigNumber2(x.isNegative() === y2.isNegative() ? Infinity : -Infinity);
    }
    return bitwise(x, y2, function(a, b) {
      return a ^ b;
    });
  }
  function leftShiftBigNumber(x, y2) {
    if (x.isFinite() && !x.isInteger() || y2.isFinite() && !y2.isInteger()) {
      throw new Error("Integers expected in function leftShift");
    }
    var BigNumber2 = x.constructor;
    if (x.isNaN() || y2.isNaN() || y2.isNegative() && !y2.isZero()) {
      return new BigNumber2(NaN);
    }
    if (x.isZero() || y2.isZero()) {
      return x;
    }
    if (!x.isFinite() && !y2.isFinite()) {
      return new BigNumber2(NaN);
    }
    if (y2.lt(55)) {
      return x.times(Math.pow(2, y2.toNumber()) + "");
    }
    return x.times(new BigNumber2(2).pow(y2));
  }
  function rightArithShiftBigNumber(x, y2) {
    if (x.isFinite() && !x.isInteger() || y2.isFinite() && !y2.isInteger()) {
      throw new Error("Integers expected in function rightArithShift");
    }
    var BigNumber2 = x.constructor;
    if (x.isNaN() || y2.isNaN() || y2.isNegative() && !y2.isZero()) {
      return new BigNumber2(NaN);
    }
    if (x.isZero() || y2.isZero()) {
      return x;
    }
    if (!y2.isFinite()) {
      if (x.isNegative()) {
        return new BigNumber2(-1);
      }
      if (!x.isFinite()) {
        return new BigNumber2(NaN);
      }
      return new BigNumber2(0);
    }
    if (y2.lt(55)) {
      return x.div(Math.pow(2, y2.toNumber()) + "").floor();
    }
    return x.div(new BigNumber2(2).pow(y2)).floor();
  }

  // node_modules/mathjs/lib/esm/function/bitwise/bitAnd.js
  var name72 = "bitAnd";
  var dependencies72 = ["typed", "matrix", "equalScalar", "concat"];
  var createBitAnd = /* @__PURE__ */ factory(name72, dependencies72, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      concat: concat3
    } = _ref;
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo06xS0S0 = createMatAlgo06xS0S0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name72, {
      "number, number": bitAndNumber,
      "BigNumber, BigNumber": bitAndBigNumber
    }, matrixAlgorithmSuite({
      SS: matAlgo06xS0S0,
      DS: matAlgo02xDS0,
      Ss: matAlgo11xS0s
    }));
  });

  // node_modules/mathjs/lib/esm/function/bitwise/bitNot.js
  var name73 = "bitNot";
  var dependencies73 = ["typed"];
  var createBitNot = /* @__PURE__ */ factory(name73, dependencies73, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name73, {
      number: bitNotNumber,
      BigNumber: bitNotBigNumber,
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/bitwise/bitOr.js
  var name74 = "bitOr";
  var dependencies74 = ["typed", "matrix", "equalScalar", "DenseMatrix", "concat"];
  var createBitOr = /* @__PURE__ */ factory(name74, dependencies74, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo04xSidSid = createMatAlgo04xSidSid({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name74, {
      "number, number": bitOrNumber,
      "BigNumber, BigNumber": bitOrBigNumber
    }, matrixAlgorithmSuite({
      SS: matAlgo04xSidSid,
      DS: matAlgo01xDSid,
      Ss: matAlgo10xSids
    }));
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo07xSSf.js
  var name75 = "matAlgo07xSSf";
  var dependencies75 = ["typed", "DenseMatrix"];
  var createMatAlgo07xSSf = /* @__PURE__ */ factory(name75, dependencies75, (_ref) => {
    var {
      typed: typed3,
      DenseMatrix: DenseMatrix2
    } = _ref;
    return function matAlgo07xSSf(a, b, callback) {
      var asize = a._size;
      var adt = a._datatype;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var i3, j;
      var cdata = [];
      for (i3 = 0; i3 < rows; i3++) {
        cdata[i3] = [];
      }
      var xa = [];
      var xb = [];
      var wa = [];
      var wb = [];
      for (j = 0; j < columns; j++) {
        var mark = j + 1;
        _scatter(a, j, wa, xa, mark);
        _scatter(b, j, wb, xb, mark);
        for (i3 = 0; i3 < rows; i3++) {
          var va = wa[i3] === mark ? xa[i3] : zero;
          var vb = wb[i3] === mark ? xb[i3] : zero;
          cdata[i3][j] = cf(va, vb);
        }
      }
      return new DenseMatrix2({
        data: cdata,
        size: [rows, columns],
        datatype: dt
      });
    };
    function _scatter(m, j, w2, x, mark) {
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
        var i3 = index2[k];
        w2[i3] = mark;
        x[i3] = values[k];
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/bitwise/bitXor.js
  var name76 = "bitXor";
  var dependencies76 = ["typed", "matrix", "DenseMatrix", "concat"];
  var createBitXor = /* @__PURE__ */ factory(name76, dependencies76, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name76, {
      "number, number": bitXorNumber,
      "BigNumber, BigNumber": bitXor
    }, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });

  // node_modules/mathjs/lib/esm/function/complex/arg.js
  var name77 = "arg";
  var dependencies77 = ["typed"];
  var createArg = /* @__PURE__ */ factory(name77, dependencies77, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name77, {
      number: function number2(x) {
        return Math.atan2(0, x);
      },
      BigNumber: function BigNumber2(x) {
        return x.constructor.atan2(0, x);
      },
      Complex: function Complex3(x) {
        return x.arg();
      },
      // TODO: implement BigNumber support for function arg
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/complex/conj.js
  var name78 = "conj";
  var dependencies78 = ["typed"];
  var createConj = /* @__PURE__ */ factory(name78, dependencies78, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name78, {
      "number | BigNumber | Fraction": (x) => x,
      Complex: (x) => x.conjugate(),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/complex/im.js
  var name79 = "im";
  var dependencies79 = ["typed"];
  var createIm = /* @__PURE__ */ factory(name79, dependencies79, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name79, {
      number: () => 0,
      "BigNumber | Fraction": (x) => x.mul(0),
      Complex: (x) => x.im,
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/complex/re.js
  var name80 = "re";
  var dependencies80 = ["typed"];
  var createRe = /* @__PURE__ */ factory(name80, dependencies80, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name80, {
      "number | BigNumber | Fraction": (x) => x,
      Complex: (x) => x.re,
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/logical/not.js
  var name81 = "not";
  var dependencies81 = ["typed"];
  var createNot = /* @__PURE__ */ factory(name81, dependencies81, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name81, {
      "null | undefined": () => true,
      number: notNumber,
      Complex: function Complex3(x) {
        return x.re === 0 && x.im === 0;
      },
      BigNumber: function BigNumber2(x) {
        return x.isZero() || x.isNaN();
      },
      Unit: typed3.referToSelf((self2) => (x) => typed3.find(self2, x.valueType())(x.value)),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/logical/or.js
  var name82 = "or";
  var dependencies82 = ["typed", "matrix", "equalScalar", "DenseMatrix", "concat"];
  var createOr = /* @__PURE__ */ factory(name82, dependencies82, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo05xSfSf = createMatAlgo05xSfSf({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name82, {
      "number, number": orNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.re !== 0 || x.im !== 0 || y2.re !== 0 || y2.im !== 0;
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return !x.isZero() && !x.isNaN() || !y2.isZero() && !y2.isNaN();
      },
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => self2(x.value || 0, y2.value || 0))
    }, matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });

  // node_modules/mathjs/lib/esm/function/logical/xor.js
  var name83 = "xor";
  var dependencies83 = ["typed", "matrix", "DenseMatrix", "concat"];
  var createXor = /* @__PURE__ */ factory(name83, dependencies83, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name83, {
      "number, number": xorNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return (x.re !== 0 || x.im !== 0) !== (y2.re !== 0 || y2.im !== 0);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return (!x.isZero() && !x.isNaN()) !== (!y2.isZero() && !y2.isNaN());
      },
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => self2(x.value || 0, y2.value || 0))
    }, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });

  // node_modules/mathjs/lib/esm/function/matrix/concat.js
  var name84 = "concat";
  var dependencies84 = ["typed", "matrix", "isInteger"];
  var createConcat = /* @__PURE__ */ factory(name84, dependencies84, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      isInteger: isInteger3
    } = _ref;
    return typed3(name84, {
      // TODO: change signature to '...Array | Matrix, dim?' when supported
      "...Array | Matrix | number | BigNumber": function ArrayMatrixNumberBigNumber(args) {
        var i3;
        var len = args.length;
        var dim = -1;
        var prevDim;
        var asMatrix = false;
        var matrices = [];
        for (i3 = 0; i3 < len; i3++) {
          var arg2 = args[i3];
          if (isMatrix(arg2)) {
            asMatrix = true;
          }
          if (isNumber(arg2) || isBigNumber(arg2)) {
            if (i3 !== len - 1) {
              throw new Error("Dimension must be specified as last argument");
            }
            prevDim = dim;
            dim = arg2.valueOf();
            if (!isInteger3(dim)) {
              throw new TypeError("Integer number expected for dimension");
            }
            if (dim < 0 || i3 > 0 && dim > prevDim) {
              throw new IndexError(dim, prevDim + 1);
            }
          } else {
            var m = clone(arg2).valueOf();
            var size2 = arraySize(m);
            matrices[i3] = m;
            prevDim = dim;
            dim = size2.length - 1;
            if (i3 > 0 && dim !== prevDim) {
              throw new DimensionError(prevDim + 1, dim + 1);
            }
          }
        }
        if (matrices.length === 0) {
          throw new SyntaxError("At least one matrix expected");
        }
        var res = matrices.shift();
        while (matrices.length) {
          res = concat(res, matrices.shift(), dim);
        }
        return asMatrix ? matrix2(res) : res;
      },
      "...string": function string2(args) {
        return args.join("");
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/column.js
  var name85 = "column";
  var dependencies85 = ["typed", "Index", "matrix", "range"];
  var createColumn = /* @__PURE__ */ factory(name85, dependencies85, (_ref) => {
    var {
      typed: typed3,
      Index: Index2,
      matrix: matrix2,
      range: range2
    } = _ref;
    return typed3(name85, {
      "Matrix, number": _column,
      "Array, number": function ArrayNumber(value, column2) {
        return _column(matrix2(clone(value)), column2).valueOf();
      }
    });
    function _column(value, column2) {
      if (value.size().length !== 2) {
        throw new Error("Only two dimensional matrix is supported");
      }
      validateIndex(column2, value.size()[1]);
      var rowRange = range2(0, value.size()[0]);
      var index2 = new Index2(rowRange, column2);
      var result = value.subset(index2);
      return isMatrix(result) ? result : matrix2([[result]]);
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/count.js
  var name86 = "count";
  var dependencies86 = ["typed", "size", "prod"];
  var createCount = /* @__PURE__ */ factory(name86, dependencies86, (_ref) => {
    var {
      typed: typed3,
      size: size2,
      prod: prod2
    } = _ref;
    return typed3(name86, {
      string: function string2(x) {
        return x.length;
      },
      "Matrix | Array": function MatrixArray(x) {
        return prod2(size2(x));
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/cross.js
  var name87 = "cross";
  var dependencies87 = ["typed", "matrix", "subtract", "multiply"];
  var createCross = /* @__PURE__ */ factory(name87, dependencies87, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      subtract: subtract2,
      multiply: multiply2
    } = _ref;
    return typed3(name87, {
      "Matrix, Matrix": function MatrixMatrix(x, y2) {
        return matrix2(_cross(x.toArray(), y2.toArray()));
      },
      "Matrix, Array": function MatrixArray(x, y2) {
        return matrix2(_cross(x.toArray(), y2));
      },
      "Array, Matrix": function ArrayMatrix(x, y2) {
        return matrix2(_cross(x, y2.toArray()));
      },
      "Array, Array": _cross
    });
    function _cross(x, y2) {
      var highestDimension = Math.max(arraySize(x).length, arraySize(y2).length);
      x = squeeze(x);
      y2 = squeeze(y2);
      var xSize = arraySize(x);
      var ySize = arraySize(y2);
      if (xSize.length !== 1 || ySize.length !== 1 || xSize[0] !== 3 || ySize[0] !== 3) {
        throw new RangeError("Vectors with length 3 expected (Size A = [" + xSize.join(", ") + "], B = [" + ySize.join(", ") + "])");
      }
      var product3 = [subtract2(multiply2(x[1], y2[2]), multiply2(x[2], y2[1])), subtract2(multiply2(x[2], y2[0]), multiply2(x[0], y2[2])), subtract2(multiply2(x[0], y2[1]), multiply2(x[1], y2[0]))];
      if (highestDimension > 1) {
        return [product3];
      } else {
        return product3;
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/diag.js
  var name88 = "diag";
  var dependencies88 = ["typed", "matrix", "DenseMatrix", "SparseMatrix"];
  var createDiag = /* @__PURE__ */ factory(name88, dependencies88, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      SparseMatrix: SparseMatrix2
    } = _ref;
    return typed3(name88, {
      // FIXME: simplify this huge amount of signatures as soon as typed-function supports optional arguments
      Array: function Array2(x) {
        return _diag(x, 0, arraySize(x), null);
      },
      "Array, number": function ArrayNumber(x, k) {
        return _diag(x, k, arraySize(x), null);
      },
      "Array, BigNumber": function ArrayBigNumber(x, k) {
        return _diag(x, k.toNumber(), arraySize(x), null);
      },
      "Array, string": function ArrayString(x, format5) {
        return _diag(x, 0, arraySize(x), format5);
      },
      "Array, number, string": function ArrayNumberString(x, k, format5) {
        return _diag(x, k, arraySize(x), format5);
      },
      "Array, BigNumber, string": function ArrayBigNumberString(x, k, format5) {
        return _diag(x, k.toNumber(), arraySize(x), format5);
      },
      Matrix: function Matrix2(x) {
        return _diag(x, 0, x.size(), x.storage());
      },
      "Matrix, number": function MatrixNumber(x, k) {
        return _diag(x, k, x.size(), x.storage());
      },
      "Matrix, BigNumber": function MatrixBigNumber(x, k) {
        return _diag(x, k.toNumber(), x.size(), x.storage());
      },
      "Matrix, string": function MatrixString(x, format5) {
        return _diag(x, 0, x.size(), format5);
      },
      "Matrix, number, string": function MatrixNumberString(x, k, format5) {
        return _diag(x, k, x.size(), format5);
      },
      "Matrix, BigNumber, string": function MatrixBigNumberString(x, k, format5) {
        return _diag(x, k.toNumber(), x.size(), format5);
      }
    });
    function _diag(x, k, size2, format5) {
      if (!isInteger(k)) {
        throw new TypeError("Second parameter in function diag must be an integer");
      }
      var kSuper = k > 0 ? k : 0;
      var kSub = k < 0 ? -k : 0;
      switch (size2.length) {
        case 1:
          return _createDiagonalMatrix(x, k, format5, size2[0], kSub, kSuper);
        case 2:
          return _getDiagonal(x, k, format5, size2, kSub, kSuper);
      }
      throw new RangeError("Matrix for function diag must be 2 dimensional");
    }
    function _createDiagonalMatrix(x, k, format5, l, kSub, kSuper) {
      var ms = [l + kSub, l + kSuper];
      if (format5 && format5 !== "sparse" && format5 !== "dense") {
        throw new TypeError("Unknown matrix type ".concat(format5, '"'));
      }
      var m = format5 === "sparse" ? SparseMatrix2.diagonal(ms, x, k) : DenseMatrix2.diagonal(ms, x, k);
      return format5 !== null ? m : m.valueOf();
    }
    function _getDiagonal(x, k, format5, s, kSub, kSuper) {
      if (isMatrix(x)) {
        var dm = x.diagonal(k);
        if (format5 !== null) {
          if (format5 !== dm.storage()) {
            return matrix2(dm, format5);
          }
          return dm;
        }
        return dm.valueOf();
      }
      var n = Math.min(s[0] - kSub, s[1] - kSuper);
      var vector = [];
      for (var i3 = 0; i3 < n; i3++) {
        vector[i3] = x[i3 + kSub][i3 + kSuper];
      }
      return format5 !== null ? matrix2(vector) : vector;
    }
  });

  // node_modules/mathjs/lib/esm/utils/applyCallback.js
  var import_typed_function2 = __toESM(require_typed_function(), 1);
  function applyCallback(callback, value, index2, array, mappingFnName) {
    if (import_typed_function2.default.isTypedFunction(callback)) {
      var args3 = [value, index2, array];
      var signature3 = import_typed_function2.default.resolve(callback, args3);
      if (signature3) {
        return tryWithArgs(signature3.implementation, args3);
      }
      var args2 = [value, index2];
      var signature2 = import_typed_function2.default.resolve(callback, args2);
      if (signature2) {
        return tryWithArgs(signature2.implementation, args2);
      }
      var args1 = [value];
      var signature1 = import_typed_function2.default.resolve(callback, args1);
      if (signature1) {
        return tryWithArgs(signature1.implementation, args1);
      }
      return tryWithArgs(callback, args3);
    } else {
      return callback(value, index2, array);
    }
    function tryWithArgs(signature, args) {
      try {
        return signature.apply(signature, args);
      } catch (err) {
        var _err$data;
        if (err instanceof TypeError && ((_err$data = err.data) === null || _err$data === void 0 ? void 0 : _err$data.category) === "wrongType") {
          var argsDesc = [];
          argsDesc.push("value: ".concat(typeOf(value)));
          if (args.length >= 2) {
            argsDesc.push("index: ".concat(typeOf(index2)));
          }
          if (args.length >= 3) {
            argsDesc.push("array: ".concat(typeOf(array)));
          }
          throw new TypeError("Function ".concat(mappingFnName, " cannot apply callback arguments ") + "".concat(callback.name, "(").concat(argsDesc.join(", "), ") at index ").concat(JSON.stringify(index2)));
        } else {
          throw new TypeError("Function ".concat(mappingFnName, " cannot apply callback arguments ") + "to function ".concat(callback.name, ": ").concat(err.message));
        }
      }
    }
  }

  // node_modules/mathjs/lib/esm/function/matrix/filter.js
  var name89 = "filter";
  var dependencies89 = ["typed"];
  var createFilter = /* @__PURE__ */ factory(name89, dependencies89, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3("filter", {
      "Array, function": _filterCallback,
      "Matrix, function": function MatrixFunction(x, test) {
        return x.create(_filterCallback(x.toArray(), test));
      },
      "Array, RegExp": filterRegExp,
      "Matrix, RegExp": function MatrixRegExp(x, test) {
        return x.create(filterRegExp(x.toArray(), test));
      }
    });
  });
  function _filterCallback(x, callback) {
    return filter(x, function(value, index2, array) {
      return applyCallback(callback, value, [index2], array, "filter");
    });
  }

  // node_modules/mathjs/lib/esm/function/matrix/flatten.js
  var name90 = "flatten";
  var dependencies90 = ["typed", "matrix"];
  var createFlatten = /* @__PURE__ */ factory(name90, dependencies90, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2
    } = _ref;
    return typed3(name90, {
      Array: function Array2(x) {
        return flatten(x);
      },
      Matrix: function Matrix2(x) {
        var flat = flatten(x.toArray());
        return matrix2(flat);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/forEach.js
  var name91 = "forEach";
  var dependencies91 = ["typed"];
  var createForEach = /* @__PURE__ */ factory(name91, dependencies91, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name91, {
      "Array, function": _forEach,
      "Matrix, function": function MatrixFunction(x, callback) {
        x.forEach(callback);
      }
    });
  });
  function _forEach(array, callback) {
    var recurse = function recurse2(value, index2) {
      if (Array.isArray(value)) {
        forEach(value, function(child, i3) {
          recurse2(child, index2.concat(i3));
        });
      } else {
        return applyCallback(callback, value, index2, array, "forEach");
      }
    };
    recurse(array, []);
  }

  // node_modules/mathjs/lib/esm/function/matrix/getMatrixDataType.js
  var name92 = "getMatrixDataType";
  var dependencies92 = ["typed"];
  var createGetMatrixDataType = /* @__PURE__ */ factory(name92, dependencies92, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name92, {
      Array: function Array2(x) {
        return getArrayDataType(x, typeOf);
      },
      Matrix: function Matrix2(x) {
        return x.getDataType();
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/identity.js
  var name93 = "identity";
  var dependencies93 = ["typed", "config", "matrix", "BigNumber", "DenseMatrix", "SparseMatrix"];
  var createIdentity = /* @__PURE__ */ factory(name93, dependencies93, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      BigNumber: BigNumber2,
      DenseMatrix: DenseMatrix2,
      SparseMatrix: SparseMatrix2
    } = _ref;
    return typed3(name93, {
      "": function _() {
        return config4.matrix === "Matrix" ? matrix2([]) : [];
      },
      string: function string2(format5) {
        return matrix2(format5);
      },
      "number | BigNumber": function numberBigNumber(rows) {
        return _identity(rows, rows, config4.matrix === "Matrix" ? "dense" : void 0);
      },
      "number | BigNumber, string": function numberBigNumberString(rows, format5) {
        return _identity(rows, rows, format5);
      },
      "number | BigNumber, number | BigNumber": function numberBigNumberNumberBigNumber(rows, cols) {
        return _identity(rows, cols, config4.matrix === "Matrix" ? "dense" : void 0);
      },
      "number | BigNumber, number | BigNumber, string": function numberBigNumberNumberBigNumberString(rows, cols, format5) {
        return _identity(rows, cols, format5);
      },
      Array: function Array2(size2) {
        return _identityVector(size2);
      },
      "Array, string": function ArrayString(size2, format5) {
        return _identityVector(size2, format5);
      },
      Matrix: function Matrix2(size2) {
        return _identityVector(size2.valueOf(), size2.storage());
      },
      "Matrix, string": function MatrixString(size2, format5) {
        return _identityVector(size2.valueOf(), format5);
      }
    });
    function _identityVector(size2, format5) {
      switch (size2.length) {
        case 0:
          return format5 ? matrix2(format5) : [];
        case 1:
          return _identity(size2[0], size2[0], format5);
        case 2:
          return _identity(size2[0], size2[1], format5);
        default:
          throw new Error("Vector containing two values expected");
      }
    }
    function _identity(rows, cols, format5) {
      var Big = isBigNumber(rows) || isBigNumber(cols) ? BigNumber2 : null;
      if (isBigNumber(rows))
        rows = rows.toNumber();
      if (isBigNumber(cols))
        cols = cols.toNumber();
      if (!isInteger(rows) || rows < 1) {
        throw new Error("Parameters in function identity must be positive integers");
      }
      if (!isInteger(cols) || cols < 1) {
        throw new Error("Parameters in function identity must be positive integers");
      }
      var one = Big ? new BigNumber2(1) : 1;
      var defaultValue = Big ? new Big(0) : 0;
      var size2 = [rows, cols];
      if (format5) {
        if (format5 === "sparse") {
          return SparseMatrix2.diagonal(size2, one, 0, defaultValue);
        }
        if (format5 === "dense") {
          return DenseMatrix2.diagonal(size2, one, 0, defaultValue);
        }
        throw new TypeError('Unknown matrix type "'.concat(format5, '"'));
      }
      var res = resize([], size2, defaultValue);
      var minimum = rows < cols ? rows : cols;
      for (var d = 0; d < minimum; d++) {
        res[d][d] = one;
      }
      return res;
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/kron.js
  var name94 = "kron";
  var dependencies94 = ["typed", "matrix", "multiplyScalar"];
  var createKron = /* @__PURE__ */ factory(name94, dependencies94, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      multiplyScalar: multiplyScalar2
    } = _ref;
    return typed3(name94, {
      "Matrix, Matrix": function MatrixMatrix(x, y2) {
        return matrix2(_kron(x.toArray(), y2.toArray()));
      },
      "Matrix, Array": function MatrixArray(x, y2) {
        return matrix2(_kron(x.toArray(), y2));
      },
      "Array, Matrix": function ArrayMatrix(x, y2) {
        return matrix2(_kron(x, y2.toArray()));
      },
      "Array, Array": _kron
    });
    function _kron(a, b) {
      if (arraySize(a).length === 1) {
        a = [a];
      }
      if (arraySize(b).length === 1) {
        b = [b];
      }
      if (arraySize(a).length > 2 || arraySize(b).length > 2) {
        throw new RangeError("Vectors with dimensions greater then 2 are not supported expected (Size x = " + JSON.stringify(a.length) + ", y = " + JSON.stringify(b.length) + ")");
      }
      var t = [];
      var r = [];
      return a.map(function(a2) {
        return b.map(function(b2) {
          r = [];
          t.push(r);
          return a2.map(function(y2) {
            return b2.map(function(x) {
              return r.push(multiplyScalar2(y2, x));
            });
          });
        });
      }) && t;
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/map.js
  var name95 = "map";
  var dependencies95 = ["typed"];
  var createMap2 = /* @__PURE__ */ factory(name95, dependencies95, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name95, {
      "Array, function": _map,
      "Matrix, function": function MatrixFunction(x, callback) {
        return x.map(callback);
      }
    });
  });
  function _map(array, callback) {
    var recurse = function recurse2(value, index2) {
      if (Array.isArray(value)) {
        return value.map(function(child, i3) {
          return recurse2(child, index2.concat(i3));
        });
      } else {
        return applyCallback(callback, value, index2, array, "map");
      }
    };
    return recurse(array, []);
  }

  // node_modules/mathjs/lib/esm/function/matrix/diff.js
  var name96 = "diff";
  var dependencies96 = ["typed", "matrix", "subtract", "number"];
  var createDiff = /* @__PURE__ */ factory(name96, dependencies96, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      subtract: subtract2,
      number: number2
    } = _ref;
    return typed3(name96, {
      "Array | Matrix": function ArrayMatrix(arr) {
        if (isMatrix(arr)) {
          return matrix2(_diff(arr.toArray()));
        } else {
          return _diff(arr);
        }
      },
      "Array | Matrix, number": function ArrayMatrixNumber(arr, dim) {
        if (!isInteger(dim))
          throw new RangeError("Dimension must be a whole number");
        if (isMatrix(arr)) {
          return matrix2(_recursive(arr.toArray(), dim));
        } else {
          return _recursive(arr, dim);
        }
      },
      "Array, BigNumber": typed3.referTo("Array,number", (selfAn) => (arr, dim) => selfAn(arr, number2(dim))),
      "Matrix, BigNumber": typed3.referTo("Matrix,number", (selfMn) => (arr, dim) => selfMn(arr, number2(dim)))
    });
    function _recursive(arr, dim) {
      if (isMatrix(arr)) {
        arr = arr.toArray();
      }
      if (!Array.isArray(arr)) {
        throw RangeError("Array/Matrix does not have that many dimensions");
      }
      if (dim > 0) {
        var result = [];
        arr.forEach((element) => {
          result.push(_recursive(element, dim - 1));
        });
        return result;
      } else if (dim === 0) {
        return _diff(arr);
      } else {
        throw RangeError("Cannot have negative dimension");
      }
    }
    function _diff(arr) {
      var result = [];
      var size2 = arr.length;
      for (var i3 = 1; i3 < size2; i3++) {
        result.push(_ElementDiff(arr[i3 - 1], arr[i3]));
      }
      return result;
    }
    function _ElementDiff(obj1, obj2) {
      if (isMatrix(obj1))
        obj1 = obj1.toArray();
      if (isMatrix(obj2))
        obj2 = obj2.toArray();
      var obj1IsArray = Array.isArray(obj1);
      var obj2IsArray = Array.isArray(obj2);
      if (obj1IsArray && obj2IsArray) {
        return _ArrayDiff(obj1, obj2);
      }
      if (!obj1IsArray && !obj2IsArray) {
        return subtract2(obj2, obj1);
      }
      throw TypeError("Cannot calculate difference between 1 array and 1 non-array");
    }
    function _ArrayDiff(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        throw RangeError("Not all sub-arrays have the same length");
      }
      var result = [];
      var size2 = arr1.length;
      for (var i3 = 0; i3 < size2; i3++) {
        result.push(_ElementDiff(arr1[i3], arr2[i3]));
      }
      return result;
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/ones.js
  var name97 = "ones";
  var dependencies97 = ["typed", "config", "matrix", "BigNumber"];
  var createOnes = /* @__PURE__ */ factory(name97, dependencies97, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      BigNumber: BigNumber2
    } = _ref;
    return typed3("ones", {
      "": function _() {
        return config4.matrix === "Array" ? _ones([]) : _ones([], "default");
      },
      // math.ones(m, n, p, ..., format)
      // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
      "...number | BigNumber | string": function numberBigNumberString(size2) {
        var last = size2[size2.length - 1];
        if (typeof last === "string") {
          var format5 = size2.pop();
          return _ones(size2, format5);
        } else if (config4.matrix === "Array") {
          return _ones(size2);
        } else {
          return _ones(size2, "default");
        }
      },
      Array: _ones,
      Matrix: function Matrix2(size2) {
        var format5 = size2.storage();
        return _ones(size2.valueOf(), format5);
      },
      "Array | Matrix, string": function ArrayMatrixString(size2, format5) {
        return _ones(size2.valueOf(), format5);
      }
    });
    function _ones(size2, format5) {
      var hasBigNumbers = _normalize(size2);
      var defaultValue = hasBigNumbers ? new BigNumber2(1) : 1;
      _validate2(size2);
      if (format5) {
        var m = matrix2(format5);
        if (size2.length > 0) {
          return m.resize(size2, defaultValue);
        }
        return m;
      } else {
        var arr = [];
        if (size2.length > 0) {
          return resize(arr, size2, defaultValue);
        }
        return arr;
      }
    }
    function _normalize(size2) {
      var hasBigNumbers = false;
      size2.forEach(function(value, index2, arr) {
        if (isBigNumber(value)) {
          hasBigNumbers = true;
          arr[index2] = value.toNumber();
        }
      });
      return hasBigNumbers;
    }
    function _validate2(size2) {
      size2.forEach(function(value) {
        if (typeof value !== "number" || !isInteger(value) || value < 0) {
          throw new Error("Parameters in function ones must be positive integers");
        }
      });
    }
  });

  // node_modules/mathjs/lib/esm/utils/noop.js
  function noBignumber() {
    throw new Error('No "bignumber" implementation available');
  }
  function noFraction() {
    throw new Error('No "fraction" implementation available');
  }
  function noMatrix() {
    throw new Error('No "matrix" implementation available');
  }

  // node_modules/mathjs/lib/esm/function/matrix/range.js
  var name98 = "range";
  var dependencies98 = ["typed", "config", "?matrix", "?bignumber", "smaller", "smallerEq", "larger", "largerEq", "add", "isPositive"];
  var createRange = /* @__PURE__ */ factory(name98, dependencies98, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      bignumber: bignumber2,
      smaller: smaller2,
      smallerEq: smallerEq2,
      larger: larger2,
      largerEq: largerEq2,
      add: add3,
      isPositive: isPositive2
    } = _ref;
    return typed3(name98, {
      // TODO: simplify signatures when typed-function supports default values and optional arguments
      // TODO: a number or boolean should not be converted to string here
      string: _strRange,
      "string, boolean": _strRange,
      "number, number": function numberNumber(start, end) {
        return _out(_range(start, end, 1, false));
      },
      "number, number, number": function numberNumberNumber(start, end, step) {
        return _out(_range(start, end, step, false));
      },
      "number, number, boolean": function numberNumberBoolean(start, end, includeEnd) {
        return _out(_range(start, end, 1, includeEnd));
      },
      "number, number, number, boolean": function numberNumberNumberBoolean(start, end, step, includeEnd) {
        return _out(_range(start, end, step, includeEnd));
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(start, end) {
        var BigNumber2 = start.constructor;
        return _out(_range(start, end, new BigNumber2(1), false));
      },
      "BigNumber, BigNumber, BigNumber": function BigNumberBigNumberBigNumber(start, end, step) {
        return _out(_range(start, end, step, false));
      },
      "BigNumber, BigNumber, boolean": function BigNumberBigNumberBoolean(start, end, includeEnd) {
        var BigNumber2 = start.constructor;
        return _out(_range(start, end, new BigNumber2(1), includeEnd));
      },
      "BigNumber, BigNumber, BigNumber, boolean": function BigNumberBigNumberBigNumberBoolean(start, end, step, includeEnd) {
        return _out(_range(start, end, step, includeEnd));
      },
      "Unit, Unit, Unit": function UnitUnitUnit(start, end, step) {
        return _out(_range(start, end, step, false));
      },
      "Unit, Unit, Unit, boolean": function UnitUnitUnitBoolean(start, end, step, includeEnd) {
        return _out(_range(start, end, step, includeEnd));
      }
    });
    function _out(arr) {
      if (config4.matrix === "Matrix") {
        return matrix2 ? matrix2(arr) : noMatrix();
      }
      return arr;
    }
    function _strRange(str, includeEnd) {
      var r = _parse(str);
      if (!r) {
        throw new SyntaxError('String "' + str + '" is no valid range');
      }
      if (config4.number === "BigNumber") {
        if (bignumber2 === void 0) {
          noBignumber();
        }
        return _out(_range(bignumber2(r.start), bignumber2(r.end), bignumber2(r.step)), includeEnd);
      } else {
        return _out(_range(r.start, r.end, r.step, includeEnd));
      }
    }
    function _range(start, end, step, includeEnd) {
      var array = [];
      var ongoing = isPositive2(step) ? includeEnd ? smallerEq2 : smaller2 : includeEnd ? largerEq2 : larger2;
      var x = start;
      while (ongoing(x, end)) {
        array.push(x);
        x = add3(x, step);
      }
      return array;
    }
    function _parse(str) {
      var args = str.split(":");
      var nums = args.map(function(arg2) {
        return Number(arg2);
      });
      var invalid = nums.some(function(num) {
        return isNaN(num);
      });
      if (invalid) {
        return null;
      }
      switch (nums.length) {
        case 2:
          return {
            start: nums[0],
            end: nums[1],
            step: 1
          };
        case 3:
          return {
            start: nums[0],
            end: nums[2],
            step: nums[1]
          };
        default:
          return null;
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/reshape.js
  var name99 = "reshape";
  var dependencies99 = ["typed", "isInteger", "matrix"];
  var createReshape = /* @__PURE__ */ factory(name99, dependencies99, (_ref) => {
    var {
      typed: typed3,
      isInteger: isInteger3
    } = _ref;
    return typed3(name99, {
      "Matrix, Array": function MatrixArray(x, sizes) {
        return x.reshape(sizes, true);
      },
      "Array, Array": function ArrayArray(x, sizes) {
        sizes.forEach(function(size2) {
          if (!isInteger3(size2)) {
            throw new TypeError("Invalid size for dimension: " + size2);
          }
        });
        return reshape(x, sizes);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/resize.js
  var name100 = "resize";
  var dependencies100 = ["config", "matrix"];
  var createResize = /* @__PURE__ */ factory(name100, dependencies100, (_ref) => {
    var {
      config: config4,
      matrix: matrix2
    } = _ref;
    return function resize3(x, size2, defaultValue) {
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw new ArgumentsError("resize", arguments.length, 2, 3);
      }
      if (isMatrix(size2)) {
        size2 = size2.valueOf();
      }
      if (isBigNumber(size2[0])) {
        size2 = size2.map(function(value) {
          return !isBigNumber(value) ? value : value.toNumber();
        });
      }
      if (isMatrix(x)) {
        return x.resize(size2, defaultValue, true);
      }
      if (typeof x === "string") {
        return _resizeString(x, size2, defaultValue);
      }
      var asMatrix = Array.isArray(x) ? false : config4.matrix !== "Array";
      if (size2.length === 0) {
        while (Array.isArray(x)) {
          x = x[0];
        }
        return clone(x);
      } else {
        if (!Array.isArray(x)) {
          x = [x];
        }
        x = clone(x);
        var res = resize(x, size2, defaultValue);
        return asMatrix ? matrix2(res) : res;
      }
    };
    function _resizeString(str, size2, defaultChar) {
      if (defaultChar !== void 0) {
        if (typeof defaultChar !== "string" || defaultChar.length !== 1) {
          throw new TypeError("Single character expected as defaultValue");
        }
      } else {
        defaultChar = " ";
      }
      if (size2.length !== 1) {
        throw new DimensionError(size2.length, 1);
      }
      var len = size2[0];
      if (typeof len !== "number" || !isInteger(len)) {
        throw new TypeError("Invalid size, must contain positive integers (size: " + format3(size2) + ")");
      }
      if (str.length > len) {
        return str.substring(0, len);
      } else if (str.length < len) {
        var res = str;
        for (var i3 = 0, ii = len - str.length; i3 < ii; i3++) {
          res += defaultChar;
        }
        return res;
      } else {
        return str;
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/rotate.js
  var name101 = "rotate";
  var dependencies101 = ["typed", "multiply", "rotationMatrix"];
  var createRotate = /* @__PURE__ */ factory(name101, dependencies101, (_ref) => {
    var {
      typed: typed3,
      multiply: multiply2,
      rotationMatrix: rotationMatrix2
    } = _ref;
    return typed3(name101, {
      "Array , number | BigNumber | Complex | Unit": function ArrayNumberBigNumberComplexUnit(w2, theta) {
        _validateSize(w2, 2);
        var matrixRes = multiply2(rotationMatrix2(theta), w2);
        return matrixRes.toArray();
      },
      "Matrix , number | BigNumber | Complex | Unit": function MatrixNumberBigNumberComplexUnit(w2, theta) {
        _validateSize(w2, 2);
        return multiply2(rotationMatrix2(theta), w2);
      },
      "Array, number | BigNumber | Complex | Unit, Array | Matrix": function ArrayNumberBigNumberComplexUnitArrayMatrix(w2, theta, v) {
        _validateSize(w2, 3);
        var matrixRes = multiply2(rotationMatrix2(theta, v), w2);
        return matrixRes;
      },
      "Matrix, number | BigNumber | Complex | Unit, Array | Matrix": function MatrixNumberBigNumberComplexUnitArrayMatrix(w2, theta, v) {
        _validateSize(w2, 3);
        return multiply2(rotationMatrix2(theta, v), w2);
      }
    });
    function _validateSize(v, expectedSize) {
      var actualSize = Array.isArray(v) ? arraySize(v) : v.size();
      if (actualSize.length > 2) {
        throw new RangeError("Vector must be of dimensions 1x".concat(expectedSize));
      }
      if (actualSize.length === 2 && actualSize[1] !== 1) {
        throw new RangeError("Vector must be of dimensions 1x".concat(expectedSize));
      }
      if (actualSize[0] !== expectedSize) {
        throw new RangeError("Vector must be of dimensions 1x".concat(expectedSize));
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/rotationMatrix.js
  var name102 = "rotationMatrix";
  var dependencies102 = ["typed", "config", "multiplyScalar", "addScalar", "unaryMinus", "norm", "matrix", "BigNumber", "DenseMatrix", "SparseMatrix", "cos", "sin"];
  var createRotationMatrix = /* @__PURE__ */ factory(name102, dependencies102, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      multiplyScalar: multiplyScalar2,
      addScalar: addScalar2,
      unaryMinus: unaryMinus2,
      norm: norm2,
      BigNumber: BigNumber2,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      SparseMatrix: SparseMatrix2,
      cos: cos3,
      sin: sin3
    } = _ref;
    return typed3(name102, {
      "": function _() {
        return config4.matrix === "Matrix" ? matrix2([]) : [];
      },
      string: function string2(format5) {
        return matrix2(format5);
      },
      "number | BigNumber | Complex | Unit": function numberBigNumberComplexUnit(theta) {
        return _rotationMatrix2x2(theta, config4.matrix === "Matrix" ? "dense" : void 0);
      },
      "number | BigNumber | Complex | Unit, string": function numberBigNumberComplexUnitString(theta, format5) {
        return _rotationMatrix2x2(theta, format5);
      },
      "number | BigNumber | Complex | Unit, Array": function numberBigNumberComplexUnitArray(theta, v) {
        var matrixV = matrix2(v);
        _validateVector(matrixV);
        return _rotationMatrix3x3(theta, matrixV, void 0);
      },
      "number | BigNumber | Complex | Unit, Matrix": function numberBigNumberComplexUnitMatrix(theta, v) {
        _validateVector(v);
        var storageType = v.storage() || (config4.matrix === "Matrix" ? "dense" : void 0);
        return _rotationMatrix3x3(theta, v, storageType);
      },
      "number | BigNumber | Complex | Unit, Array, string": function numberBigNumberComplexUnitArrayString(theta, v, format5) {
        var matrixV = matrix2(v);
        _validateVector(matrixV);
        return _rotationMatrix3x3(theta, matrixV, format5);
      },
      "number | BigNumber | Complex | Unit, Matrix, string": function numberBigNumberComplexUnitMatrixString(theta, v, format5) {
        _validateVector(v);
        return _rotationMatrix3x3(theta, v, format5);
      }
    });
    function _rotationMatrix2x2(theta, format5) {
      var Big = isBigNumber(theta);
      var minusOne = Big ? new BigNumber2(-1) : -1;
      var cosTheta = cos3(theta);
      var sinTheta = sin3(theta);
      var data = [[cosTheta, multiplyScalar2(minusOne, sinTheta)], [sinTheta, cosTheta]];
      return _convertToFormat(data, format5);
    }
    function _validateVector(v) {
      var size2 = v.size();
      if (size2.length < 1 || size2[0] !== 3) {
        throw new RangeError("Vector must be of dimensions 1x3");
      }
    }
    function _mul(array) {
      return array.reduce((p, curr) => multiplyScalar2(p, curr));
    }
    function _convertToFormat(data, format5) {
      if (format5) {
        if (format5 === "sparse") {
          return new SparseMatrix2(data);
        }
        if (format5 === "dense") {
          return new DenseMatrix2(data);
        }
        throw new TypeError('Unknown matrix type "'.concat(format5, '"'));
      }
      return data;
    }
    function _rotationMatrix3x3(theta, v, format5) {
      var normV = norm2(v);
      if (normV === 0) {
        throw new RangeError("Rotation around zero vector");
      }
      var Big = isBigNumber(theta) ? BigNumber2 : null;
      var one = Big ? new Big(1) : 1;
      var minusOne = Big ? new Big(-1) : -1;
      var vx = Big ? new Big(v.get([0]) / normV) : v.get([0]) / normV;
      var vy = Big ? new Big(v.get([1]) / normV) : v.get([1]) / normV;
      var vz = Big ? new Big(v.get([2]) / normV) : v.get([2]) / normV;
      var c = cos3(theta);
      var oneMinusC = addScalar2(one, unaryMinus2(c));
      var s = sin3(theta);
      var r11 = addScalar2(c, _mul([vx, vx, oneMinusC]));
      var r12 = addScalar2(_mul([vx, vy, oneMinusC]), _mul([minusOne, vz, s]));
      var r13 = addScalar2(_mul([vx, vz, oneMinusC]), _mul([vy, s]));
      var r21 = addScalar2(_mul([vx, vy, oneMinusC]), _mul([vz, s]));
      var r22 = addScalar2(c, _mul([vy, vy, oneMinusC]));
      var r23 = addScalar2(_mul([vy, vz, oneMinusC]), _mul([minusOne, vx, s]));
      var r31 = addScalar2(_mul([vx, vz, oneMinusC]), _mul([minusOne, vy, s]));
      var r32 = addScalar2(_mul([vy, vz, oneMinusC]), _mul([vx, s]));
      var r33 = addScalar2(c, _mul([vz, vz, oneMinusC]));
      var data = [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]];
      return _convertToFormat(data, format5);
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/row.js
  var name103 = "row";
  var dependencies103 = ["typed", "Index", "matrix", "range"];
  var createRow = /* @__PURE__ */ factory(name103, dependencies103, (_ref) => {
    var {
      typed: typed3,
      Index: Index2,
      matrix: matrix2,
      range: range2
    } = _ref;
    return typed3(name103, {
      "Matrix, number": _row,
      "Array, number": function ArrayNumber(value, row2) {
        return _row(matrix2(clone(value)), row2).valueOf();
      }
    });
    function _row(value, row2) {
      if (value.size().length !== 2) {
        throw new Error("Only two dimensional matrix is supported");
      }
      validateIndex(row2, value.size()[0]);
      var columnRange = range2(0, value.size()[1]);
      var index2 = new Index2(row2, columnRange);
      var result = value.subset(index2);
      return isMatrix(result) ? result : matrix2([[result]]);
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/size.js
  var name104 = "size";
  var dependencies104 = ["typed", "config", "?matrix"];
  var createSize = /* @__PURE__ */ factory(name104, dependencies104, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2
    } = _ref;
    return typed3(name104, {
      Matrix: function Matrix2(x) {
        return x.create(x.size());
      },
      Array: arraySize,
      string: function string2(x) {
        return config4.matrix === "Array" ? [x.length] : matrix2([x.length]);
      },
      "number | Complex | BigNumber | Unit | boolean | null": function numberComplexBigNumberUnitBooleanNull(x) {
        return config4.matrix === "Array" ? [] : matrix2 ? matrix2([]) : noMatrix();
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/squeeze.js
  var name105 = "squeeze";
  var dependencies105 = ["typed", "matrix"];
  var createSqueeze = /* @__PURE__ */ factory(name105, dependencies105, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2
    } = _ref;
    return typed3(name105, {
      Array: function Array2(x) {
        return squeeze(clone(x));
      },
      Matrix: function Matrix2(x) {
        var res = squeeze(x.toArray());
        return Array.isArray(res) ? matrix2(res) : res;
      },
      any: function any(x) {
        return clone(x);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/subset.js
  var name106 = "subset";
  var dependencies106 = ["typed", "matrix", "zeros", "add"];
  var createSubset = /* @__PURE__ */ factory(name106, dependencies106, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      zeros: zeros3,
      add: add3
    } = _ref;
    return typed3(name106, {
      // get subset
      "Matrix, Index": function MatrixIndex(value, index2) {
        if (isEmptyIndex(index2)) {
          return matrix2();
        }
        validateIndexSourceSize(value, index2);
        return value.subset(index2);
      },
      "Array, Index": typed3.referTo("Matrix, Index", function(subsetRef) {
        return function(value, index2) {
          var subsetResult = subsetRef(matrix2(value), index2);
          return index2.isScalar() ? subsetResult : subsetResult.valueOf();
        };
      }),
      "Object, Index": _getObjectProperty,
      "string, Index": _getSubstring,
      // set subset
      "Matrix, Index, any, any": function MatrixIndexAnyAny(value, index2, replacement, defaultValue) {
        if (isEmptyIndex(index2)) {
          return value;
        }
        validateIndexSourceSize(value, index2);
        return value.clone().subset(index2, _broadcastReplacement(replacement, index2), defaultValue);
      },
      "Array, Index, any, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
        return function(value, index2, replacement, defaultValue) {
          var subsetResult = subsetRef(matrix2(value), index2, replacement, defaultValue);
          return subsetResult.isMatrix ? subsetResult.valueOf() : subsetResult;
        };
      }),
      "Array, Index, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
        return function(value, index2, replacement) {
          return subsetRef(matrix2(value), index2, replacement, void 0).valueOf();
        };
      }),
      "Matrix, Index, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
        return function(value, index2, replacement) {
          return subsetRef(value, index2, replacement, void 0);
        };
      }),
      "string, Index, string": _setSubstring,
      "string, Index, string, string": _setSubstring,
      "Object, Index, any": _setObjectProperty
    });
    function _broadcastReplacement(replacement, index2) {
      if (typeof replacement === "string") {
        throw new Error("can't boradcast a string");
      }
      if (index2._isScalar) {
        return replacement;
      }
      var indexSize = index2.size();
      if (indexSize.every((d) => d > 0)) {
        try {
          return add3(replacement, zeros3(indexSize));
        } catch (error) {
          return replacement;
        }
      } else {
        return replacement;
      }
    }
  });
  function _getSubstring(str, index2) {
    if (!isIndex(index2)) {
      throw new TypeError("Index expected");
    }
    if (isEmptyIndex(index2)) {
      return "";
    }
    validateIndexSourceSize(Array.from(str), index2);
    if (index2.size().length !== 1) {
      throw new DimensionError(index2.size().length, 1);
    }
    var strLen = str.length;
    validateIndex(index2.min()[0], strLen);
    validateIndex(index2.max()[0], strLen);
    var range2 = index2.dimension(0);
    var substr = "";
    range2.forEach(function(v) {
      substr += str.charAt(v);
    });
    return substr;
  }
  function _setSubstring(str, index2, replacement, defaultValue) {
    if (!index2 || index2.isIndex !== true) {
      throw new TypeError("Index expected");
    }
    if (isEmptyIndex(index2)) {
      return str;
    }
    validateIndexSourceSize(Array.from(str), index2);
    if (index2.size().length !== 1) {
      throw new DimensionError(index2.size().length, 1);
    }
    if (defaultValue !== void 0) {
      if (typeof defaultValue !== "string" || defaultValue.length !== 1) {
        throw new TypeError("Single character expected as defaultValue");
      }
    } else {
      defaultValue = " ";
    }
    var range2 = index2.dimension(0);
    var len = range2.size()[0];
    if (len !== replacement.length) {
      throw new DimensionError(range2.size()[0], replacement.length);
    }
    var strLen = str.length;
    validateIndex(index2.min()[0]);
    validateIndex(index2.max()[0]);
    var chars = [];
    for (var i3 = 0; i3 < strLen; i3++) {
      chars[i3] = str.charAt(i3);
    }
    range2.forEach(function(v, i4) {
      chars[v] = replacement.charAt(i4[0]);
    });
    if (chars.length > strLen) {
      for (var _i = strLen - 1, _len = chars.length; _i < _len; _i++) {
        if (!chars[_i]) {
          chars[_i] = defaultValue;
        }
      }
    }
    return chars.join("");
  }
  function _getObjectProperty(object, index2) {
    if (isEmptyIndex(index2)) {
      return void 0;
    }
    if (index2.size().length !== 1) {
      throw new DimensionError(index2.size(), 1);
    }
    var key = index2.dimension(0);
    if (typeof key !== "string") {
      throw new TypeError("String expected as index to retrieve an object property");
    }
    return getSafeProperty(object, key);
  }
  function _setObjectProperty(object, index2, replacement) {
    if (isEmptyIndex(index2)) {
      return object;
    }
    if (index2.size().length !== 1) {
      throw new DimensionError(index2.size(), 1);
    }
    var key = index2.dimension(0);
    if (typeof key !== "string") {
      throw new TypeError("String expected as index to retrieve an object property");
    }
    var updated = clone(object);
    setSafeProperty(updated, key, replacement);
    return updated;
  }

  // node_modules/mathjs/lib/esm/function/matrix/transpose.js
  var name107 = "transpose";
  var dependencies107 = ["typed", "matrix"];
  var createTranspose = /* @__PURE__ */ factory(name107, dependencies107, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2
    } = _ref;
    return typed3(name107, {
      Array: (x) => transposeMatrix(matrix2(x)).valueOf(),
      Matrix: transposeMatrix,
      any: clone
      // scalars
    });
    function transposeMatrix(x) {
      var size2 = x.size();
      var c;
      switch (size2.length) {
        case 1:
          c = x.clone();
          break;
        case 2:
          {
            var rows = size2[0];
            var columns = size2[1];
            if (columns === 0) {
              throw new RangeError("Cannot transpose a 2D matrix with no columns (size: " + format3(size2) + ")");
            }
            switch (x.storage()) {
              case "dense":
                c = _denseTranspose(x, rows, columns);
                break;
              case "sparse":
                c = _sparseTranspose(x, rows, columns);
                break;
            }
          }
          break;
        default:
          throw new RangeError("Matrix must be a vector or two dimensional (size: " + format3(size2) + ")");
      }
      return c;
    }
    function _denseTranspose(m, rows, columns) {
      var data = m._data;
      var transposed = [];
      var transposedRow;
      for (var j = 0; j < columns; j++) {
        transposedRow = transposed[j] = [];
        for (var i3 = 0; i3 < rows; i3++) {
          transposedRow[i3] = clone(data[i3][j]);
        }
      }
      return m.createDenseMatrix({
        data: transposed,
        size: [columns, rows],
        datatype: m._datatype
      });
    }
    function _sparseTranspose(m, rows, columns) {
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      var cvalues = values ? [] : void 0;
      var cindex = [];
      var cptr = [];
      var w2 = [];
      for (var x = 0; x < rows; x++) {
        w2[x] = 0;
      }
      var p, l, j;
      for (p = 0, l = index2.length; p < l; p++) {
        w2[index2[p]]++;
      }
      var sum3 = 0;
      for (var i3 = 0; i3 < rows; i3++) {
        cptr.push(sum3);
        sum3 += w2[i3];
        w2[i3] = cptr[i3];
      }
      cptr.push(sum3);
      for (j = 0; j < columns; j++) {
        for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
          var q = w2[index2[k]]++;
          cindex[q] = j;
          if (values) {
            cvalues[q] = clone(values[k]);
          }
        }
      }
      return m.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [columns, rows],
        datatype: m._datatype
      });
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/ctranspose.js
  var name108 = "ctranspose";
  var dependencies108 = ["typed", "transpose", "conj"];
  var createCtranspose = /* @__PURE__ */ factory(name108, dependencies108, (_ref) => {
    var {
      typed: typed3,
      transpose: transpose2,
      conj: conj2
    } = _ref;
    return typed3(name108, {
      any: function any(x) {
        return conj2(transpose2(x));
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/zeros.js
  var name109 = "zeros";
  var dependencies109 = ["typed", "config", "matrix", "BigNumber"];
  var createZeros = /* @__PURE__ */ factory(name109, dependencies109, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      BigNumber: BigNumber2
    } = _ref;
    return typed3(name109, {
      "": function _() {
        return config4.matrix === "Array" ? _zeros([]) : _zeros([], "default");
      },
      // math.zeros(m, n, p, ..., format)
      // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
      "...number | BigNumber | string": function numberBigNumberString(size2) {
        var last = size2[size2.length - 1];
        if (typeof last === "string") {
          var format5 = size2.pop();
          return _zeros(size2, format5);
        } else if (config4.matrix === "Array") {
          return _zeros(size2);
        } else {
          return _zeros(size2, "default");
        }
      },
      Array: _zeros,
      Matrix: function Matrix2(size2) {
        var format5 = size2.storage();
        return _zeros(size2.valueOf(), format5);
      },
      "Array | Matrix, string": function ArrayMatrixString(size2, format5) {
        return _zeros(size2.valueOf(), format5);
      }
    });
    function _zeros(size2, format5) {
      var hasBigNumbers = _normalize(size2);
      var defaultValue = hasBigNumbers ? new BigNumber2(0) : 0;
      _validate2(size2);
      if (format5) {
        var m = matrix2(format5);
        if (size2.length > 0) {
          return m.resize(size2, defaultValue);
        }
        return m;
      } else {
        var arr = [];
        if (size2.length > 0) {
          return resize(arr, size2, defaultValue);
        }
        return arr;
      }
    }
    function _normalize(size2) {
      var hasBigNumbers = false;
      size2.forEach(function(value, index2, arr) {
        if (isBigNumber(value)) {
          hasBigNumbers = true;
          arr[index2] = value.toNumber();
        }
      });
      return hasBigNumbers;
    }
    function _validate2(size2) {
      size2.forEach(function(value) {
        if (typeof value !== "number" || !isInteger(value) || value < 0) {
          throw new Error("Parameters in function zeros must be positive integers");
        }
      });
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/fft.js
  var name110 = "fft";
  var dependencies110 = ["typed", "matrix", "addScalar", "multiplyScalar", "divideScalar", "exp", "tau", "i", "dotDivide", "conj", "pow", "ceil", "log2"];
  var createFft = /* @__PURE__ */ factory(name110, dependencies110, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      addScalar: addScalar2,
      multiplyScalar: multiplyScalar2,
      divideScalar: divideScalar2,
      exp: exp3,
      tau: tau3,
      i: I2,
      dotDivide: dotDivide2,
      conj: conj2,
      pow: pow3,
      ceil: ceil3,
      log2: log25
    } = _ref;
    return typed3(name110, {
      Array: _ndFft,
      Matrix: function Matrix2(matrix3) {
        return matrix3.create(_ndFft(matrix3.toArray()));
      }
    });
    function _ndFft(arr) {
      var size2 = arraySize(arr);
      if (size2.length === 1)
        return _fft(arr, size2[0]);
      return _1dFft(arr.map((slice) => _ndFft(slice, size2.slice(1))), 0);
    }
    function _1dFft(arr, dim) {
      var size2 = arraySize(arr);
      if (dim !== 0)
        return new Array(size2[0]).fill(0).map((_, i3) => _1dFft(arr[i3], dim - 1));
      if (size2.length === 1)
        return _fft(arr);
      function _transpose(arr2) {
        var size3 = arraySize(arr2);
        return new Array(size3[1]).fill(0).map((_, j) => new Array(size3[0]).fill(0).map((_2, i3) => arr2[i3][j]));
      }
      return _transpose(_1dFft(_transpose(arr), 1));
    }
    function _czt(arr) {
      var n = arr.length;
      var w2 = exp3(divideScalar2(multiplyScalar2(-1, multiplyScalar2(I2, tau3)), n));
      var chirp = [];
      for (var i3 = 1 - n; i3 < n; i3++) {
        chirp.push(pow3(w2, divideScalar2(pow3(i3, 2), 2)));
      }
      var N2 = pow3(2, ceil3(log25(n + n - 1)));
      var xp = [...new Array(n).fill(0).map((_, i4) => multiplyScalar2(arr[i4], chirp[n - 1 + i4])), ...new Array(N2 - n).fill(0)];
      var ichirp = [...new Array(n + n - 1).fill(0).map((_, i4) => divideScalar2(1, chirp[i4])), ...new Array(N2 - (n + n - 1)).fill(0)];
      var fftXp = _fft(xp);
      var fftIchirp = _fft(ichirp);
      var fftProduct = new Array(N2).fill(0).map((_, i4) => multiplyScalar2(fftXp[i4], fftIchirp[i4]));
      var ifftProduct = dotDivide2(conj2(_ndFft(conj2(fftProduct))), N2);
      var ret = [];
      for (var _i = n - 1; _i < n + n - 1; _i++) {
        ret.push(multiplyScalar2(ifftProduct[_i], chirp[_i]));
      }
      return ret;
    }
    function _fft(arr) {
      var len = arr.length;
      if (len === 1)
        return [arr[0]];
      if (len % 2 === 0) {
        var ret = [..._fft(arr.filter((_, i3) => i3 % 2 === 0), len / 2), ..._fft(arr.filter((_, i3) => i3 % 2 === 1), len / 2)];
        for (var k = 0; k < len / 2; k++) {
          var p = ret[k];
          var q = multiplyScalar2(ret[k + len / 2], exp3(multiplyScalar2(multiplyScalar2(tau3, I2), divideScalar2(-k, len))));
          ret[k] = addScalar2(p, q);
          ret[k + len / 2] = addScalar2(p, multiplyScalar2(-1, q));
        }
        return ret;
      } else {
        return _czt(arr);
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/ifft.js
  var name111 = "ifft";
  var dependencies111 = ["typed", "fft", "dotDivide", "conj"];
  var createIfft = /* @__PURE__ */ factory(name111, dependencies111, (_ref) => {
    var {
      typed: typed3,
      fft: fft2,
      dotDivide: dotDivide2,
      conj: conj2
    } = _ref;
    return typed3(name111, {
      "Array | Matrix": function ArrayMatrix(arr) {
        var size2 = isMatrix(arr) ? arr.size() : arraySize(arr);
        return dotDivide2(conj2(fft2(conj2(arr))), size2.reduce((acc, curr) => acc * curr, 1));
      }
    });
  });

  // node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
      return typeof o3;
    } : function(o3) {
      return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
    }, _typeof(o2);
  }

  // node_modules/@babel/runtime/helpers/esm/toPrimitive.js
  function _toPrimitive(input2, hint) {
    if (_typeof(input2) !== "object" || input2 === null)
      return input2;
    var prim = input2[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input2, hint || "default");
      if (_typeof(res) !== "object")
        return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input2);
  }

  // node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
  function _toPropertyKey(arg2) {
    var key = _toPrimitive(arg2, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }

  // node_modules/@babel/runtime/helpers/esm/defineProperty.js
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  // node_modules/mathjs/lib/esm/function/numeric/solveODE.js
  function ownKeys(e3, r) {
    var t = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e3);
      r && (o2 = o2.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e3, r2).enumerable;
      })), t.push.apply(t, o2);
    }
    return t;
  }
  function _objectSpread(e3) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e3, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e3, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e3;
  }
  var name112 = "solveODE";
  var dependencies112 = ["typed", "add", "subtract", "multiply", "divide", "max", "map", "abs", "isPositive", "isNegative", "larger", "smaller", "matrix", "bignumber", "unaryMinus"];
  var createSolveODE = /* @__PURE__ */ factory(name112, dependencies112, (_ref) => {
    var {
      typed: typed3,
      add: add3,
      subtract: subtract2,
      multiply: multiply2,
      divide: divide3,
      max: max3,
      map: map3,
      abs: abs3,
      isPositive: isPositive2,
      isNegative: isNegative2,
      larger: larger2,
      smaller: smaller2,
      matrix: matrix2,
      bignumber: bignumber2,
      unaryMinus: unaryMinus2
    } = _ref;
    function _rk(butcherTableau) {
      return function(f, tspan, y0, options) {
        var wrongTSpan = !(tspan.length === 2 && (tspan.every(isNumOrBig) || tspan.every(isUnit)));
        if (wrongTSpan) {
          throw new Error('"tspan" must be an Array of two numeric values or two units [tStart, tEnd]');
        }
        var t0 = tspan[0];
        var tf = tspan[1];
        var isForwards = larger2(tf, t0);
        var firstStep = options.firstStep;
        if (firstStep !== void 0 && !isPositive2(firstStep)) {
          throw new Error('"firstStep" must be positive');
        }
        var maxStep = options.maxStep;
        if (maxStep !== void 0 && !isPositive2(maxStep)) {
          throw new Error('"maxStep" must be positive');
        }
        var minStep = options.minStep;
        if (minStep && isNegative2(minStep)) {
          throw new Error('"minStep" must be positive or zero');
        }
        var timeVars = [t0, tf, firstStep, minStep, maxStep].filter((x) => x !== void 0);
        if (!(timeVars.every(isNumOrBig) || timeVars.every(isUnit))) {
          throw new Error('Inconsistent type of "t" dependant variables');
        }
        var steps = 1;
        var tol = options.tol ? options.tol : 1e-4;
        var minDelta = options.minDelta ? options.minDelta : 0.2;
        var maxDelta = options.maxDelta ? options.maxDelta : 5;
        var maxIter = options.maxIter ? options.maxIter : 1e4;
        var hasBigNumbers = [t0, tf, ...y0, maxStep, minStep].some(isBigNumber);
        var [a, c, b, bp] = hasBigNumbers ? [bignumber2(butcherTableau.a), bignumber2(butcherTableau.c), bignumber2(butcherTableau.b), bignumber2(butcherTableau.bp)] : [butcherTableau.a, butcherTableau.c, butcherTableau.b, butcherTableau.bp];
        var h = firstStep ? isForwards ? firstStep : unaryMinus2(firstStep) : divide3(subtract2(tf, t0), steps);
        var t = [t0];
        var y2 = [y0];
        var deltaB = subtract2(b, bp);
        var n = 0;
        var iter = 0;
        var ongoing = _createOngoing(isForwards);
        var trimStep = _createTrimStep(isForwards);
        while (ongoing(t[n], tf)) {
          var k = [];
          h = trimStep(t[n], tf, h);
          k.push(f(t[n], y2[n]));
          for (var i3 = 1; i3 < c.length; ++i3) {
            k.push(f(add3(t[n], multiply2(c[i3], h)), add3(y2[n], multiply2(h, a[i3], k))));
          }
          var TE = max3(abs3(map3(multiply2(deltaB, k), (X) => isUnit(X) ? X.value : X)));
          if (TE < tol && tol / TE > 1 / 4) {
            t.push(add3(t[n], h));
            y2.push(add3(y2[n], multiply2(h, b, k)));
            n++;
          }
          var delta = 0.84 * (tol / TE) ** (1 / 5);
          if (smaller2(delta, minDelta)) {
            delta = minDelta;
          } else if (larger2(delta, maxDelta)) {
            delta = maxDelta;
          }
          delta = hasBigNumbers ? bignumber2(delta) : delta;
          h = multiply2(h, delta);
          if (maxStep && larger2(abs3(h), maxStep)) {
            h = isForwards ? maxStep : unaryMinus2(maxStep);
          } else if (minStep && smaller2(abs3(h), minStep)) {
            h = isForwards ? minStep : unaryMinus2(minStep);
          }
          iter++;
          if (iter > maxIter) {
            throw new Error("Maximum number of iterations reached, try changing options");
          }
        }
        return {
          t,
          y: y2
        };
      };
    }
    function _rk23(f, tspan, y0, options) {
      var a = [[], [1 / 2], [0, 3 / 4], [2 / 9, 1 / 3, 4 / 9]];
      var c = [null, 1 / 2, 3 / 4, 1];
      var b = [2 / 9, 1 / 3, 4 / 9, 0];
      var bp = [7 / 24, 1 / 4, 1 / 3, 1 / 8];
      var butcherTableau = {
        a,
        c,
        b,
        bp
      };
      return _rk(butcherTableau)(f, tspan, y0, options);
    }
    function _rk45(f, tspan, y0, options) {
      var a = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]];
      var c = [null, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
      var b = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
      var bp = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];
      var butcherTableau = {
        a,
        c,
        b,
        bp
      };
      return _rk(butcherTableau)(f, tspan, y0, options);
    }
    function _solveODE(f, tspan, y0, opt) {
      var method = opt.method ? opt.method : "RK45";
      var methods = {
        RK23: _rk23,
        RK45: _rk45
      };
      if (method.toUpperCase() in methods) {
        var methodOptions = _objectSpread({}, opt);
        delete methodOptions.method;
        return methods[method.toUpperCase()](f, tspan, y0, methodOptions);
      } else {
        var methodsWithQuotes = Object.keys(methods).map((x) => '"'.concat(x, '"'));
        var availableMethodsString = "".concat(methodsWithQuotes.slice(0, -1).join(", "), " and ").concat(methodsWithQuotes.slice(-1));
        throw new Error('Unavailable method "'.concat(method, '". Available methods are ').concat(availableMethodsString));
      }
    }
    function _createOngoing(isForwards) {
      return isForwards ? smaller2 : larger2;
    }
    function _createTrimStep(isForwards) {
      var outOfBounds = isForwards ? larger2 : smaller2;
      return function(t, tf, h) {
        var next = add3(t, h);
        return outOfBounds(next, tf) ? subtract2(tf, t) : h;
      };
    }
    function isNumOrBig(x) {
      return isBigNumber(x) || isNumber(x);
    }
    function _matrixSolveODE(f, T, y0, options) {
      var sol = _solveODE(f, T.toArray(), y0.toArray(), options);
      return {
        t: matrix2(sol.t),
        y: matrix2(sol.y)
      };
    }
    return typed3("solveODE", {
      "function, Array, Array, Object": _solveODE,
      "function, Matrix, Matrix, Object": _matrixSolveODE,
      "function, Array, Array": (f, T, y0) => _solveODE(f, T, y0, {}),
      "function, Matrix, Matrix": (f, T, y0) => _matrixSolveODE(f, T, y0, {}),
      "function, Array, number | BigNumber | Unit": (f, T, y0) => {
        var sol = _solveODE(f, T, [y0], {});
        return {
          t: sol.t,
          y: sol.y.map((Y) => Y[0])
        };
      },
      "function, Matrix, number | BigNumber | Unit": (f, T, y0) => {
        var sol = _solveODE(f, T.toArray(), [y0], {});
        return {
          t: matrix2(sol.t),
          y: matrix2(sol.y.map((Y) => Y[0]))
        };
      },
      "function, Array, number | BigNumber | Unit, Object": (f, T, y0, options) => {
        var sol = _solveODE(f, T, [y0], options);
        return {
          t: sol.t,
          y: sol.y.map((Y) => Y[0])
        };
      },
      "function, Matrix, number | BigNumber | Unit, Object": (f, T, y0, options) => {
        var sol = _solveODE(f, T.toArray(), [y0], options);
        return {
          t: matrix2(sol.t),
          y: matrix2(sol.y.map((Y) => Y[0]))
        };
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/special/erf.js
  var name113 = "erf";
  var dependencies113 = ["typed"];
  var createErf = /* @__PURE__ */ factory(name113, dependencies113, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3("name", {
      number: function number2(x) {
        var y2 = Math.abs(x);
        if (y2 >= MAX_NUM) {
          return sign(x);
        }
        if (y2 <= THRESH) {
          return sign(x) * erf1(y2);
        }
        if (y2 <= 4) {
          return sign(x) * (1 - erfc2(y2));
        }
        return sign(x) * (1 - erfc3(y2));
      },
      "Array | Matrix": typed3.referToSelf((self2) => (n) => deepMap(n, self2))
      // TODO: For complex numbers, use the approximation for the Faddeeva function
      //  from "More Efficient Computation of the Complex Error Function" (AMS)
    });
    function erf1(y2) {
      var ysq = y2 * y2;
      var xnum = P2[0][4] * ysq;
      var xden = ysq;
      var i3;
      for (i3 = 0; i3 < 3; i3 += 1) {
        xnum = (xnum + P2[0][i3]) * ysq;
        xden = (xden + Q2[0][i3]) * ysq;
      }
      return y2 * (xnum + P2[0][3]) / (xden + Q2[0][3]);
    }
    function erfc2(y2) {
      var xnum = P2[1][8] * y2;
      var xden = y2;
      var i3;
      for (i3 = 0; i3 < 7; i3 += 1) {
        xnum = (xnum + P2[1][i3]) * y2;
        xden = (xden + Q2[1][i3]) * y2;
      }
      var result = (xnum + P2[1][7]) / (xden + Q2[1][7]);
      var ysq = parseInt(y2 * 16) / 16;
      var del = (y2 - ysq) * (y2 + ysq);
      return Math.exp(-ysq * ysq) * Math.exp(-del) * result;
    }
    function erfc3(y2) {
      var ysq = 1 / (y2 * y2);
      var xnum = P2[2][5] * ysq;
      var xden = ysq;
      var i3;
      for (i3 = 0; i3 < 4; i3 += 1) {
        xnum = (xnum + P2[2][i3]) * ysq;
        xden = (xden + Q2[2][i3]) * ysq;
      }
      var result = ysq * (xnum + P2[2][4]) / (xden + Q2[2][4]);
      result = (SQRPI - result) / y2;
      ysq = parseInt(y2 * 16) / 16;
      var del = (y2 - ysq) * (y2 + ysq);
      return Math.exp(-ysq * ysq) * Math.exp(-del) * result;
    }
  });
  var THRESH = 0.46875;
  var SQRPI = 0.5641895835477563;
  var P2 = [[3.1611237438705655, 113.86415415105016, 377.485237685302, 3209.3775891384694, 0.18577770618460315], [0.5641884969886701, 8.883149794388377, 66.11919063714163, 298.6351381974001, 881.952221241769, 1712.0476126340707, 2051.0783778260716, 1230.3393547979972, 21531153547440383e-24], [0.30532663496123236, 0.36034489994980445, 0.12578172611122926, 0.016083785148742275, 6587491615298378e-19, 0.016315387137302097]];
  var Q2 = [[23.601290952344122, 244.02463793444417, 1282.6165260773723, 2844.236833439171], [15.744926110709835, 117.6939508913125, 537.1811018620099, 1621.3895745666903, 3290.7992357334597, 4362.619090143247, 3439.3676741437216, 1230.3393548037495], [2.568520192289822, 1.8729528499234604, 0.5279051029514285, 0.06051834131244132, 0.0023352049762686918]];
  var MAX_NUM = Math.pow(2, 53);

  // node_modules/mathjs/lib/esm/function/special/zeta.js
  var name114 = "zeta";
  var dependencies114 = ["typed", "config", "multiply", "pow", "divide", "factorial", "equal", "smallerEq", "isNegative", "gamma", "sin", "subtract", "add", "?Complex", "?BigNumber", "pi"];
  var createZeta = /* @__PURE__ */ factory(name114, dependencies114, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      multiply: multiply2,
      pow: pow3,
      divide: divide3,
      factorial: factorial2,
      equal: equal2,
      smallerEq: smallerEq2,
      isNegative: isNegative2,
      gamma: gamma2,
      sin: sin3,
      subtract: subtract2,
      add: add3,
      Complex: Complex3,
      BigNumber: _BigNumber,
      pi: pi3
    } = _ref;
    return typed3(name114, {
      number: (s) => zetaNumeric(s, (value) => value, () => 20),
      BigNumber: (s) => zetaNumeric(s, (value) => new _BigNumber(value), () => {
        return Math.abs(Math.log10(config4.epsilon));
      }),
      Complex: zetaComplex
    });
    function zetaNumeric(s, createValue, determineDigits) {
      if (equal2(s, 0)) {
        return createValue(-0.5);
      }
      if (equal2(s, 1)) {
        return createValue(NaN);
      }
      if (!isFinite(s)) {
        return isNegative2(s) ? createValue(NaN) : createValue(1);
      }
      return zeta2(s, createValue, determineDigits, (s2) => s2);
    }
    function zetaComplex(s) {
      if (s.re === 0 && s.im === 0) {
        return new Complex3(-0.5);
      }
      if (s.re === 1) {
        return new Complex3(NaN, NaN);
      }
      if (s.re === Infinity && s.im === 0) {
        return new Complex3(1);
      }
      if (s.im === Infinity || s.re === -Infinity) {
        return new Complex3(NaN, NaN);
      }
      return zeta2(s, (value) => value, (s2) => Math.round(1.3 * 15 + 0.9 * Math.abs(s2.im)), (s2) => s2.re);
    }
    function zeta2(s, createValue, determineDigits, getRe) {
      var n = determineDigits(s);
      if (getRe(s) > -(n - 1) / 2) {
        return f(s, createValue(n), createValue);
      } else {
        var c = multiply2(pow3(2, s), pow3(createValue(pi3), subtract2(s, 1)));
        c = multiply2(c, sin3(multiply2(divide3(createValue(pi3), 2), s)));
        c = multiply2(c, gamma2(subtract2(1, s)));
        return multiply2(c, zeta2(subtract2(1, s), createValue, determineDigits, getRe));
      }
    }
    function d(k, n) {
      var S = k;
      for (var j = k; smallerEq2(j, n); j = add3(j, 1)) {
        var factor = divide3(multiply2(factorial2(add3(n, subtract2(j, 1))), pow3(4, j)), multiply2(factorial2(subtract2(n, j)), factorial2(multiply2(2, j))));
        S = add3(S, factor);
      }
      return multiply2(n, S);
    }
    function f(s, n, createValue) {
      var c = divide3(1, multiply2(d(createValue(0), n), subtract2(1, pow3(2, subtract2(1, s)))));
      var S = createValue(0);
      for (var k = createValue(1); smallerEq2(k, n); k = add3(k, 1)) {
        S = add3(S, divide3(multiply2((-1) ** (k - 1), d(k, n)), pow3(k, s)));
      }
      return multiply2(c, S);
    }
  });

  // node_modules/mathjs/lib/esm/function/statistics/mode.js
  var name115 = "mode";
  var dependencies115 = ["typed", "isNaN", "isNumeric"];
  var createMode = /* @__PURE__ */ factory(name115, dependencies115, (_ref) => {
    var {
      typed: typed3,
      isNaN: isNaN3,
      isNumeric: isNumeric2
    } = _ref;
    return typed3(name115, {
      "Array | Matrix": _mode,
      "...": function _(args) {
        return _mode(args);
      }
    });
    function _mode(values) {
      values = flatten(values.valueOf());
      var num = values.length;
      if (num === 0) {
        throw new Error("Cannot calculate mode of an empty array");
      }
      var count2 = {};
      var mode2 = [];
      var max3 = 0;
      for (var i3 = 0; i3 < values.length; i3++) {
        var value = values[i3];
        if (isNumeric2(value) && isNaN3(value)) {
          throw new Error("Cannot calculate mode of an array containing NaN values");
        }
        if (!(value in count2)) {
          count2[value] = 0;
        }
        count2[value]++;
        if (count2[value] === max3) {
          mode2.push(value);
        } else if (count2[value] > max3) {
          max3 = count2[value];
          mode2 = [value];
        }
      }
      return mode2;
    }
  });

  // node_modules/mathjs/lib/esm/function/statistics/utils/improveErrorMessage.js
  function improveErrorMessage(err, fnName, value) {
    var details;
    if (String(err).indexOf("Unexpected type") !== -1) {
      details = arguments.length > 2 ? " (type: " + typeOf(value) + ", value: " + JSON.stringify(value) + ")" : " (type: " + err.data.actual + ")";
      return new TypeError("Cannot calculate " + fnName + ", unexpected type of argument" + details);
    }
    if (String(err).indexOf("complex numbers") !== -1) {
      details = arguments.length > 2 ? " (type: " + typeOf(value) + ", value: " + JSON.stringify(value) + ")" : "";
      return new TypeError("Cannot calculate " + fnName + ", no ordering relation is defined for complex numbers" + details);
    }
    return err;
  }

  // node_modules/mathjs/lib/esm/function/statistics/prod.js
  var name116 = "prod";
  var dependencies116 = ["typed", "config", "multiplyScalar", "numeric"];
  var createProd = /* @__PURE__ */ factory(name116, dependencies116, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      multiplyScalar: multiplyScalar2,
      numeric: numeric3
    } = _ref;
    return typed3(name116, {
      // prod([a, b, c, d, ...])
      "Array | Matrix": _prod,
      // prod([a, b, c, d, ...], dim)
      "Array | Matrix, number | BigNumber": function ArrayMatrixNumberBigNumber(array, dim) {
        throw new Error("prod(A, dim) is not yet supported");
      },
      // prod(a, b, c, d, ...)
      "...": function _(args) {
        return _prod(args);
      }
    });
    function _prod(array) {
      var prod2;
      deepForEach(array, function(value) {
        try {
          prod2 = prod2 === void 0 ? value : multiplyScalar2(prod2, value);
        } catch (err) {
          throw improveErrorMessage(err, "prod", value);
        }
      });
      if (typeof prod2 === "string") {
        prod2 = numeric3(prod2, config4.number);
      }
      if (prod2 === void 0) {
        throw new Error("Cannot calculate prod of an empty array");
      }
      return prod2;
    }
  });

  // node_modules/mathjs/lib/esm/function/string/format.js
  var name117 = "format";
  var dependencies117 = ["typed"];
  var createFormat = /* @__PURE__ */ factory(name117, dependencies117, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name117, {
      any: format3,
      "any, Object | function | number": format3
    });
  });

  // node_modules/mathjs/lib/esm/function/string/bin.js
  var name118 = "bin";
  var dependencies118 = ["typed", "format"];
  var createBin = factory(name118, dependencies118, (_ref) => {
    var {
      typed: typed3,
      format: format5
    } = _ref;
    return typed3(name118, {
      "number | BigNumber": function numberBigNumber(n) {
        return format5(n, {
          notation: "bin"
        });
      },
      "number | BigNumber, number": function numberBigNumberNumber(n, wordSize) {
        return format5(n, {
          notation: "bin",
          wordSize
        });
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/string/oct.js
  var name119 = "oct";
  var dependencies119 = ["typed", "format"];
  var createOct = factory(name119, dependencies119, (_ref) => {
    var {
      typed: typed3,
      format: format5
    } = _ref;
    return typed3(name119, {
      "number | BigNumber": function numberBigNumber(n) {
        return format5(n, {
          notation: "oct"
        });
      },
      "number | BigNumber, number": function numberBigNumberNumber(n, wordSize) {
        return format5(n, {
          notation: "oct",
          wordSize
        });
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/string/hex.js
  var name120 = "hex";
  var dependencies120 = ["typed", "format"];
  var createHex = factory(name120, dependencies120, (_ref) => {
    var {
      typed: typed3,
      format: format5
    } = _ref;
    return typed3(name120, {
      "number | BigNumber": function numberBigNumber(n) {
        return format5(n, {
          notation: "hex"
        });
      },
      "number | BigNumber, number": function numberBigNumberNumber(n, wordSize) {
        return format5(n, {
          notation: "hex",
          wordSize
        });
      }
    });
  });

  // node_modules/mathjs/lib/esm/utils/print.js
  var printTemplate = /\$([\w.]+)/g;

  // node_modules/mathjs/lib/esm/function/string/print.js
  var name121 = "print";
  var dependencies121 = ["typed"];
  var createPrint = /* @__PURE__ */ factory(name121, dependencies121, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name121, {
      // note: Matrix will be converted automatically to an Array
      "string, Object | Array": _print,
      "string, Object | Array, number | Object": _print
    });
  });
  function _print(template, values, options) {
    return template.replace(printTemplate, function(original, key) {
      var keys = key.split(".");
      var value = values[keys.shift()];
      if (value !== void 0 && value.isMatrix) {
        value = value.toArray();
      }
      while (keys.length && value !== void 0) {
        var k = keys.shift();
        value = k ? value[k] : value + ".";
      }
      if (value !== void 0) {
        if (!isString(value)) {
          return format3(value, options);
        } else {
          return value;
        }
      }
      return original;
    });
  }

  // node_modules/mathjs/lib/esm/function/unit/to.js
  var name122 = "to";
  var dependencies122 = ["typed", "matrix", "concat"];
  var createTo = /* @__PURE__ */ factory(name122, dependencies122, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    } = _ref;
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name122, {
      "Unit, Unit | string": (x, unit2) => x.to(unit2)
    }, matrixAlgorithmSuite({
      Ds: true
    }));
  });

  // node_modules/mathjs/lib/esm/function/utils/isPrime.js
  var name123 = "isPrime";
  var dependencies123 = ["typed"];
  var createIsPrime = /* @__PURE__ */ factory(name123, dependencies123, (_ref) => {
    var {
      typed: typed3
    } = _ref;
    return typed3(name123, {
      number: function number2(x) {
        if (x * 0 !== 0) {
          return false;
        }
        if (x <= 3) {
          return x > 1;
        }
        if (x % 2 === 0 || x % 3 === 0) {
          return false;
        }
        for (var i3 = 5; i3 * i3 <= x; i3 += 6) {
          if (x % i3 === 0 || x % (i3 + 2) === 0) {
            return false;
          }
        }
        return true;
      },
      BigNumber: function BigNumber2(n) {
        if (n.toNumber() * 0 !== 0) {
          return false;
        }
        if (n.lte(3))
          return n.gt(1);
        if (n.mod(2).eq(0) || n.mod(3).eq(0))
          return false;
        if (n.lt(Math.pow(2, 32))) {
          var x = n.toNumber();
          for (var i3 = 5; i3 * i3 <= x; i3 += 6) {
            if (x % i3 === 0 || x % (i3 + 2) === 0) {
              return false;
            }
          }
          return true;
        }
        function modPow(base, exponent, modulus) {
          var accumulator = 1;
          while (!exponent.eq(0)) {
            if (exponent.mod(2).eq(0)) {
              exponent = exponent.div(2);
              base = base.mul(base).mod(modulus);
            } else {
              exponent = exponent.sub(1);
              accumulator = base.mul(accumulator).mod(modulus);
            }
          }
          return accumulator;
        }
        var Decimal2 = n.constructor.clone({
          precision: n.toFixed(0).length * 2
        });
        n = new Decimal2(n);
        var r = 0;
        var d = n.sub(1);
        while (d.mod(2).eq(0)) {
          d = d.div(2);
          r += 1;
        }
        var bases = null;
        if (n.lt("3317044064679887385961981")) {
          bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41].filter((x2) => x2 < n);
        } else {
          var max3 = Math.min(n.toNumber() - 2, Math.floor(2 * Math.pow(n.toFixed(0).length * Math.log(10), 2)));
          bases = [];
          for (var _i = 2; _i <= max3; _i += 1) {
            bases.push(max3);
          }
        }
        for (var _i2 = 0; _i2 < bases.length; _i2 += 1) {
          var a = bases[_i2];
          var adn = modPow(n.sub(n).add(a), d, n);
          if (!adn.eq(1)) {
            for (var _i3 = 0, _x = adn; !_x.eq(n.sub(1)); _i3 += 1, _x = _x.mul(_x).mod(n)) {
              if (_i3 === r - 1) {
                return false;
              }
            }
          }
        }
        return true;
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2))
    });
  });

  // node_modules/mathjs/lib/esm/function/utils/numeric.js
  var name124 = "numeric";
  var dependencies124 = ["number", "?bignumber", "?fraction"];
  var createNumeric = /* @__PURE__ */ factory(name124, dependencies124, (_ref) => {
    var {
      number: _number,
      bignumber: bignumber2,
      fraction: fraction2
    } = _ref;
    var validInputTypes = {
      string: true,
      number: true,
      BigNumber: true,
      Fraction: true
    };
    var validOutputTypes = {
      number: (x) => _number(x),
      BigNumber: bignumber2 ? (x) => bignumber2(x) : noBignumber,
      Fraction: fraction2 ? (x) => fraction2(x) : noFraction
    };
    return function numeric3(value) {
      var outputType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "number";
      var check = arguments.length > 2 ? arguments[2] : void 0;
      if (check !== void 0) {
        throw new SyntaxError("numeric() takes one or two arguments");
      }
      var inputType = typeOf(value);
      if (!(inputType in validInputTypes)) {
        throw new TypeError("Cannot convert " + value + ' of type "' + inputType + '"; valid input types are ' + Object.keys(validInputTypes).join(", "));
      }
      if (!(outputType in validOutputTypes)) {
        throw new TypeError("Cannot convert " + value + ' to type "' + outputType + '"; valid output types are ' + Object.keys(validOutputTypes).join(", "));
      }
      if (outputType === inputType) {
        return value;
      } else {
        return validOutputTypes[outputType](value);
      }
    };
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/divideScalar.js
  var name125 = "divideScalar";
  var dependencies125 = ["typed", "numeric"];
  var createDivideScalar = /* @__PURE__ */ factory(name125, dependencies125, (_ref) => {
    var {
      typed: typed3,
      numeric: numeric3
    } = _ref;
    return typed3(name125, {
      "number, number": function numberNumber(x, y2) {
        return x / y2;
      },
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.div(y2);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.div(y2);
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return x.div(y2);
      },
      "Unit, number | Complex | Fraction | BigNumber | Unit": (x, y2) => x.divide(y2),
      "number | Fraction | Complex | BigNumber, Unit": (x, y2) => y2.divideInto(x)
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/pow.js
  var name126 = "pow";
  var dependencies126 = ["typed", "config", "identity", "multiply", "matrix", "inv", "fraction", "number", "Complex"];
  var createPow = /* @__PURE__ */ factory(name126, dependencies126, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      identity: identity2,
      multiply: multiply2,
      matrix: matrix2,
      inv: inv2,
      number: number2,
      fraction: fraction2,
      Complex: Complex3
    } = _ref;
    return typed3(name126, {
      "number, number": _pow,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return x.pow(y2);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        if (y2.isInteger() || x >= 0 || config4.predictable) {
          return x.pow(y2);
        } else {
          return new Complex3(x.toNumber(), 0).pow(y2.toNumber(), 0);
        }
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        var result = x.pow(y2);
        if (result != null) {
          return result;
        }
        if (config4.predictable) {
          throw new Error("Result of pow is non-rational and cannot be expressed as a fraction");
        } else {
          return _pow(x.valueOf(), y2.valueOf());
        }
      },
      "Array, number": _powArray,
      "Array, BigNumber": function ArrayBigNumber(x, y2) {
        return _powArray(x, y2.toNumber());
      },
      "Matrix, number": _powMatrix,
      "Matrix, BigNumber": function MatrixBigNumber(x, y2) {
        return _powMatrix(x, y2.toNumber());
      },
      "Unit, number | BigNumber": function UnitNumberBigNumber(x, y2) {
        return x.pow(y2);
      }
    });
    function _pow(x, y2) {
      if (config4.predictable && !isInteger(y2) && x < 0) {
        try {
          var yFrac = fraction2(y2);
          var yNum = number2(yFrac);
          if (y2 === yNum || Math.abs((y2 - yNum) / y2) < 1e-14) {
            if (yFrac.d % 2 === 1) {
              return (yFrac.n % 2 === 0 ? 1 : -1) * Math.pow(-x, y2);
            }
          }
        } catch (ex) {
        }
      }
      if (config4.predictable && (x < -1 && y2 === Infinity || x > -1 && x < 0 && y2 === -Infinity)) {
        return NaN;
      }
      if (isInteger(y2) || x >= 0 || config4.predictable) {
        return powNumber(x, y2);
      } else {
        if (x * x < 1 && y2 === Infinity || x * x > 1 && y2 === -Infinity) {
          return 0;
        }
        return new Complex3(x, 0).pow(y2, 0);
      }
    }
    function _powArray(x, y2) {
      if (!isInteger(y2)) {
        throw new TypeError("For A^b, b must be an integer (value is " + y2 + ")");
      }
      var s = arraySize(x);
      if (s.length !== 2) {
        throw new Error("For A^b, A must be 2 dimensional (A has " + s.length + " dimensions)");
      }
      if (s[0] !== s[1]) {
        throw new Error("For A^b, A must be square (size is " + s[0] + "x" + s[1] + ")");
      }
      if (y2 < 0) {
        try {
          return _powArray(inv2(x), -y2);
        } catch (error) {
          if (error.message === "Cannot calculate inverse, determinant is zero") {
            throw new TypeError("For A^b, when A is not invertible, b must be a positive integer (value is " + y2 + ")");
          }
          throw error;
        }
      }
      var res = identity2(s[0]).valueOf();
      var px = x;
      while (y2 >= 1) {
        if ((y2 & 1) === 1) {
          res = multiply2(px, res);
        }
        y2 >>= 1;
        px = multiply2(px, px);
      }
      return res;
    }
    function _powMatrix(x, y2) {
      return matrix2(_powArray(x.valueOf(), y2));
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/round.js
  var NO_INT = "Number of decimals in function round must be an integer";
  var name127 = "round";
  var dependencies127 = ["typed", "matrix", "equalScalar", "zeros", "BigNumber", "DenseMatrix"];
  var createRound = /* @__PURE__ */ factory(name127, dependencies127, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      BigNumber: BigNumber2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    return typed3(name127, {
      number: roundNumber,
      "number, number": roundNumber,
      "number, BigNumber": function numberBigNumber(x, n) {
        if (!n.isInteger()) {
          throw new TypeError(NO_INT);
        }
        return new BigNumber2(x).toDecimalPlaces(n.toNumber());
      },
      Complex: function Complex3(x) {
        return x.round();
      },
      "Complex, number": function ComplexNumber(x, n) {
        if (n % 1) {
          throw new TypeError(NO_INT);
        }
        return x.round(n);
      },
      "Complex, BigNumber": function ComplexBigNumber(x, n) {
        if (!n.isInteger()) {
          throw new TypeError(NO_INT);
        }
        var _n = n.toNumber();
        return x.round(_n);
      },
      BigNumber: function BigNumber3(x) {
        return x.toDecimalPlaces(0);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, n) {
        if (!n.isInteger()) {
          throw new TypeError(NO_INT);
        }
        return x.toDecimalPlaces(n.toNumber());
      },
      Fraction: function Fraction3(x) {
        return x.round();
      },
      "Fraction, number": function FractionNumber(x, n) {
        if (n % 1) {
          throw new TypeError(NO_INT);
        }
        return x.round(n);
      },
      "Fraction, BigNumber": function FractionBigNumber(x, n) {
        if (!n.isInteger()) {
          throw new TypeError(NO_INT);
        }
        return x.round(n.toNumber());
      },
      "Unit, number, Unit": typed3.referToSelf((self2) => function(x, n, unit2) {
        var valueless = x.toNumeric(unit2);
        return unit2.multiply(self2(valueless, n));
      }),
      "Unit, BigNumber, Unit": typed3.referToSelf((self2) => (x, n, unit2) => self2(x, n.toNumber(), unit2)),
      "Unit, Unit": typed3.referToSelf((self2) => (x, unit2) => self2(x, 0, unit2)),
      "Array | Matrix, number, Unit": typed3.referToSelf((self2) => (x, n, unit2) => {
        return deepMap(x, (value) => self2(value, n, unit2), true);
      }),
      "Array | Matrix, BigNumber, Unit": typed3.referToSelf((self2) => (x, n, unit2) => self2(x, n.toNumber(), unit2)),
      "Array | Matrix, Unit": typed3.referToSelf((self2) => (x, unit2) => self2(x, 0, unit2)),
      "Array | Matrix": typed3.referToSelf((self2) => (x) => {
        return deepMap(x, self2, true);
      }),
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return matAlgo11xS0s(x, n, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return matAlgo14xDs(x, n, self2, false);
      }),
      "Array, number | BigNumber": typed3.referToSelf((self2) => (x, n) => {
        return matAlgo14xDs(matrix2(x), n, self2, false).valueOf();
      }),
      "number | Complex | BigNumber | Fraction, SparseMatrix": typed3.referToSelf((self2) => (x, n) => {
        if (equalScalar2(x, 0)) {
          return zeros3(n.size(), n.storage());
        }
        return matAlgo12xSfs(n, x, self2, true);
      }),
      "number | Complex | BigNumber | Fraction, DenseMatrix": typed3.referToSelf((self2) => (x, n) => {
        if (equalScalar2(x, 0)) {
          return zeros3(n.size(), n.storage());
        }
        return matAlgo14xDs(n, x, self2, true);
      }),
      "number | Complex | BigNumber | Fraction, Array": typed3.referToSelf((self2) => (x, n) => {
        return matAlgo14xDs(matrix2(n), x, self2, true).valueOf();
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/log.js
  var name128 = "log";
  var dependencies128 = ["config", "typed", "divideScalar", "Complex"];
  var createLog = /* @__PURE__ */ factory(name128, dependencies128, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      divideScalar: divideScalar2,
      Complex: Complex3
    } = _ref;
    return typed3(name128, {
      number: function number2(x) {
        if (x >= 0 || config4.predictable) {
          return logNumber(x);
        } else {
          return new Complex3(x, 0).log();
        }
      },
      Complex: function Complex4(x) {
        return x.log();
      },
      BigNumber: function BigNumber2(x) {
        if (!x.isNegative() || config4.predictable) {
          return x.ln();
        } else {
          return new Complex3(x.toNumber(), 0).log();
        }
      },
      "any, any": typed3.referToSelf((self2) => (x, base) => {
        return divideScalar2(self2(x), self2(base));
      })
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/log1p.js
  var name129 = "log1p";
  var dependencies129 = ["typed", "config", "divideScalar", "log", "Complex"];
  var createLog1p = /* @__PURE__ */ factory(name129, dependencies129, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      divideScalar: divideScalar2,
      log: log4,
      Complex: Complex3
    } = _ref;
    return typed3(name129, {
      number: function number2(x) {
        if (x >= -1 || config4.predictable) {
          return log1p(x);
        } else {
          return _log1pComplex(new Complex3(x, 0));
        }
      },
      Complex: _log1pComplex,
      BigNumber: function BigNumber2(x) {
        var y2 = x.plus(1);
        if (!y2.isNegative() || config4.predictable) {
          return y2.ln();
        } else {
          return _log1pComplex(new Complex3(x.toNumber(), 0));
        }
      },
      "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap(x, self2)),
      "any, any": typed3.referToSelf((self2) => (x, base) => {
        return divideScalar2(self2(x), log4(base));
      })
    });
    function _log1pComplex(x) {
      var xRe1p = x.re + 1;
      return new Complex3(Math.log(Math.sqrt(xRe1p * xRe1p + x.im * x.im)), Math.atan2(x.im, xRe1p));
    }
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/nthRoots.js
  var name130 = "nthRoots";
  var dependencies130 = ["config", "typed", "divideScalar", "Complex"];
  var createNthRoots = /* @__PURE__ */ factory(name130, dependencies130, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      divideScalar: divideScalar2,
      Complex: Complex3
    } = _ref;
    var _calculateExactResult = [function realPos(val) {
      return new Complex3(val, 0);
    }, function imagPos(val) {
      return new Complex3(0, val);
    }, function realNeg(val) {
      return new Complex3(-val, 0);
    }, function imagNeg(val) {
      return new Complex3(0, -val);
    }];
    function _nthComplexRoots(a, root) {
      if (root < 0)
        throw new Error("Root must be greater than zero");
      if (root === 0)
        throw new Error("Root must be non-zero");
      if (root % 1 !== 0)
        throw new Error("Root must be an integer");
      if (a === 0 || a.abs() === 0)
        return [new Complex3(0, 0)];
      var aIsNumeric = typeof a === "number";
      var offset;
      if (aIsNumeric || a.re === 0 || a.im === 0) {
        if (aIsNumeric) {
          offset = 2 * +(a < 0);
        } else if (a.im === 0) {
          offset = 2 * +(a.re < 0);
        } else {
          offset = 2 * +(a.im < 0) + 1;
        }
      }
      var arg2 = a.arg();
      var abs3 = a.abs();
      var roots = [];
      var r = Math.pow(abs3, 1 / root);
      for (var k = 0; k < root; k++) {
        var halfPiFactor = (offset + 4 * k) / root;
        if (halfPiFactor === Math.round(halfPiFactor)) {
          roots.push(_calculateExactResult[halfPiFactor % 4](r));
          continue;
        }
        roots.push(new Complex3({
          r,
          phi: (arg2 + 2 * Math.PI * k) / root
        }));
      }
      return roots;
    }
    return typed3(name130, {
      Complex: function Complex4(x) {
        return _nthComplexRoots(x, 2);
      },
      "Complex, number": _nthComplexRoots
    });
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/dotPow.js
  var name131 = "dotPow";
  var dependencies131 = ["typed", "equalScalar", "matrix", "pow", "DenseMatrix", "concat"];
  var createDotPow = /* @__PURE__ */ factory(name131, dependencies131, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2,
      matrix: matrix2,
      pow: pow3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var powScalarSignatures = {};
    for (var signature in pow3.signatures) {
      if (Object.prototype.hasOwnProperty.call(pow3.signatures, signature)) {
        if (!signature.includes("Matrix") && !signature.includes("Array")) {
          powScalarSignatures[signature] = pow3.signatures[signature];
        }
      }
    }
    var powScalar = typed3(powScalarSignatures);
    return typed3(name131, matrixAlgorithmSuite({
      elop: powScalar,
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo11xS0s,
      sS: matAlgo12xSfs
    }));
  });

  // node_modules/mathjs/lib/esm/function/arithmetic/dotDivide.js
  var name132 = "dotDivide";
  var dependencies132 = ["typed", "matrix", "equalScalar", "divideScalar", "DenseMatrix", "concat"];
  var createDotDivide = /* @__PURE__ */ factory(name132, dependencies132, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      divideScalar: divideScalar2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name132, matrixAlgorithmSuite({
      elop: divideScalar2,
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      SD: matAlgo02xDS0,
      Ss: matAlgo11xS0s,
      sS: matAlgo12xSfs
    }));
  });

  // node_modules/mathjs/lib/esm/function/algebra/solver/utils/solveValidation.js
  function createSolveValidation(_ref) {
    var {
      DenseMatrix: DenseMatrix2
    } = _ref;
    return function solveValidation(m, b, copy) {
      var mSize = m.size();
      if (mSize.length !== 2) {
        throw new RangeError("Matrix must be two dimensional (size: " + format3(mSize) + ")");
      }
      var rows = mSize[0];
      var columns = mSize[1];
      if (rows !== columns) {
        throw new RangeError("Matrix must be square (size: " + format3(mSize) + ")");
      }
      var data = [];
      if (isMatrix(b)) {
        var bSize = b.size();
        var bdata = b._data;
        if (bSize.length === 1) {
          if (bSize[0] !== rows) {
            throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
          }
          for (var i3 = 0; i3 < rows; i3++) {
            data[i3] = [bdata[i3]];
          }
          return new DenseMatrix2({
            data,
            size: [rows, 1],
            datatype: b._datatype
          });
        }
        if (bSize.length === 2) {
          if (bSize[0] !== rows || bSize[1] !== 1) {
            throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
          }
          if (isDenseMatrix(b)) {
            if (copy) {
              data = [];
              for (var _i = 0; _i < rows; _i++) {
                data[_i] = [bdata[_i][0]];
              }
              return new DenseMatrix2({
                data,
                size: [rows, 1],
                datatype: b._datatype
              });
            }
            return b;
          }
          if (isSparseMatrix(b)) {
            for (var _i2 = 0; _i2 < rows; _i2++) {
              data[_i2] = [0];
            }
            var values = b._values;
            var index2 = b._index;
            var ptr = b._ptr;
            for (var k1 = ptr[1], k = ptr[0]; k < k1; k++) {
              var _i3 = index2[k];
              data[_i3][0] = values[k];
            }
            return new DenseMatrix2({
              data,
              size: [rows, 1],
              datatype: b._datatype
            });
          }
        }
        throw new RangeError("Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.");
      }
      if (isArray(b)) {
        var bsize = arraySize(b);
        if (bsize.length === 1) {
          if (bsize[0] !== rows) {
            throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
          }
          for (var _i4 = 0; _i4 < rows; _i4++) {
            data[_i4] = [b[_i4]];
          }
          return new DenseMatrix2({
            data,
            size: [rows, 1]
          });
        }
        if (bsize.length === 2) {
          if (bsize[0] !== rows || bsize[1] !== 1) {
            throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
          }
          for (var _i5 = 0; _i5 < rows; _i5++) {
            data[_i5] = [b[_i5][0]];
          }
          return new DenseMatrix2({
            data,
            size: [rows, 1]
          });
        }
        throw new RangeError("Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.");
      }
    };
  }

  // node_modules/mathjs/lib/esm/function/algebra/solver/lsolve.js
  var name133 = "lsolve";
  var dependencies133 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
  var createLsolve = /* @__PURE__ */ factory(name133, dependencies133, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      divideScalar: divideScalar2,
      multiplyScalar: multiplyScalar2,
      subtractScalar: subtractScalar2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    var solveValidation = createSolveValidation({
      DenseMatrix: DenseMatrix2
    });
    return typed3(name133, {
      "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
        return _sparseForwardSubstitution(m, b);
      },
      "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
        return _denseForwardSubstitution(m, b);
      },
      "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
        var m = matrix2(a);
        var r = _denseForwardSubstitution(m, b);
        return r.valueOf();
      }
    });
    function _denseForwardSubstitution(m, b) {
      b = solveValidation(m, b, true);
      var bdata = b._data;
      var rows = m._size[0];
      var columns = m._size[1];
      var x = [];
      var mdata = m._data;
      for (var j = 0; j < columns; j++) {
        var bj = bdata[j][0] || 0;
        var xj = void 0;
        if (!equalScalar2(bj, 0)) {
          var vjj = mdata[j][j];
          if (equalScalar2(vjj, 0)) {
            throw new Error("Linear system cannot be solved since matrix is singular");
          }
          xj = divideScalar2(bj, vjj);
          for (var i3 = j + 1; i3 < rows; i3++) {
            bdata[i3] = [subtractScalar2(bdata[i3][0] || 0, multiplyScalar2(xj, mdata[i3][j]))];
          }
        } else {
          xj = 0;
        }
        x[j] = [xj];
      }
      return new DenseMatrix2({
        data: x,
        size: [rows, 1]
      });
    }
    function _sparseForwardSubstitution(m, b) {
      b = solveValidation(m, b, true);
      var bdata = b._data;
      var rows = m._size[0];
      var columns = m._size[1];
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      var x = [];
      for (var j = 0; j < columns; j++) {
        var bj = bdata[j][0] || 0;
        if (!equalScalar2(bj, 0)) {
          var vjj = 0;
          var jValues = [];
          var jIndices = [];
          var firstIndex = ptr[j];
          var lastIndex = ptr[j + 1];
          for (var k = firstIndex; k < lastIndex; k++) {
            var i3 = index2[k];
            if (i3 === j) {
              vjj = values[k];
            } else if (i3 > j) {
              jValues.push(values[k]);
              jIndices.push(i3);
            }
          }
          if (equalScalar2(vjj, 0)) {
            throw new Error("Linear system cannot be solved since matrix is singular");
          }
          var xj = divideScalar2(bj, vjj);
          for (var _k = 0, l = jIndices.length; _k < l; _k++) {
            var _i = jIndices[_k];
            bdata[_i] = [subtractScalar2(bdata[_i][0] || 0, multiplyScalar2(xj, jValues[_k]))];
          }
          x[j] = [xj];
        } else {
          x[j] = [0];
        }
      }
      return new DenseMatrix2({
        data: x,
        size: [rows, 1]
      });
    }
  });

  // node_modules/mathjs/lib/esm/function/algebra/solver/usolve.js
  var name134 = "usolve";
  var dependencies134 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
  var createUsolve = /* @__PURE__ */ factory(name134, dependencies134, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      divideScalar: divideScalar2,
      multiplyScalar: multiplyScalar2,
      subtractScalar: subtractScalar2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    var solveValidation = createSolveValidation({
      DenseMatrix: DenseMatrix2
    });
    return typed3(name134, {
      "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
        return _sparseBackwardSubstitution(m, b);
      },
      "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
        return _denseBackwardSubstitution(m, b);
      },
      "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
        var m = matrix2(a);
        var r = _denseBackwardSubstitution(m, b);
        return r.valueOf();
      }
    });
    function _denseBackwardSubstitution(m, b) {
      b = solveValidation(m, b, true);
      var bdata = b._data;
      var rows = m._size[0];
      var columns = m._size[1];
      var x = [];
      var mdata = m._data;
      for (var j = columns - 1; j >= 0; j--) {
        var bj = bdata[j][0] || 0;
        var xj = void 0;
        if (!equalScalar2(bj, 0)) {
          var vjj = mdata[j][j];
          if (equalScalar2(vjj, 0)) {
            throw new Error("Linear system cannot be solved since matrix is singular");
          }
          xj = divideScalar2(bj, vjj);
          for (var i3 = j - 1; i3 >= 0; i3--) {
            bdata[i3] = [subtractScalar2(bdata[i3][0] || 0, multiplyScalar2(xj, mdata[i3][j]))];
          }
        } else {
          xj = 0;
        }
        x[j] = [xj];
      }
      return new DenseMatrix2({
        data: x,
        size: [rows, 1]
      });
    }
    function _sparseBackwardSubstitution(m, b) {
      b = solveValidation(m, b, true);
      var bdata = b._data;
      var rows = m._size[0];
      var columns = m._size[1];
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      var x = [];
      for (var j = columns - 1; j >= 0; j--) {
        var bj = bdata[j][0] || 0;
        if (!equalScalar2(bj, 0)) {
          var vjj = 0;
          var jValues = [];
          var jIndices = [];
          var firstIndex = ptr[j];
          var lastIndex = ptr[j + 1];
          for (var k = lastIndex - 1; k >= firstIndex; k--) {
            var i3 = index2[k];
            if (i3 === j) {
              vjj = values[k];
            } else if (i3 < j) {
              jValues.push(values[k]);
              jIndices.push(i3);
            }
          }
          if (equalScalar2(vjj, 0)) {
            throw new Error("Linear system cannot be solved since matrix is singular");
          }
          var xj = divideScalar2(bj, vjj);
          for (var _k = 0, _lastIndex = jIndices.length; _k < _lastIndex; _k++) {
            var _i = jIndices[_k];
            bdata[_i] = [subtractScalar2(bdata[_i][0], multiplyScalar2(xj, jValues[_k]))];
          }
          x[j] = [xj];
        } else {
          x[j] = [0];
        }
      }
      return new DenseMatrix2({
        data: x,
        size: [rows, 1]
      });
    }
  });

  // node_modules/mathjs/lib/esm/function/algebra/solver/lsolveAll.js
  var name135 = "lsolveAll";
  var dependencies135 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
  var createLsolveAll = /* @__PURE__ */ factory(name135, dependencies135, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      divideScalar: divideScalar2,
      multiplyScalar: multiplyScalar2,
      subtractScalar: subtractScalar2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    var solveValidation = createSolveValidation({
      DenseMatrix: DenseMatrix2
    });
    return typed3(name135, {
      "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
        return _sparseForwardSubstitution(m, b);
      },
      "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
        return _denseForwardSubstitution(m, b);
      },
      "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
        var m = matrix2(a);
        var R = _denseForwardSubstitution(m, b);
        return R.map((r) => r.valueOf());
      }
    });
    function _denseForwardSubstitution(m, b_) {
      var B2 = [solveValidation(m, b_, true)._data.map((e3) => e3[0])];
      var M = m._data;
      var rows = m._size[0];
      var columns = m._size[1];
      for (var i3 = 0; i3 < columns; i3++) {
        var L = B2.length;
        for (var k = 0; k < L; k++) {
          var b = B2[k];
          if (!equalScalar2(M[i3][i3], 0)) {
            b[i3] = divideScalar2(b[i3], M[i3][i3]);
            for (var j = i3 + 1; j < columns; j++) {
              b[j] = subtractScalar2(b[j], multiplyScalar2(b[i3], M[j][i3]));
            }
          } else if (!equalScalar2(b[i3], 0)) {
            if (k === 0) {
              return [];
            } else {
              B2.splice(k, 1);
              k -= 1;
              L -= 1;
            }
          } else if (k === 0) {
            var bNew = [...b];
            bNew[i3] = 1;
            for (var _j = i3 + 1; _j < columns; _j++) {
              bNew[_j] = subtractScalar2(bNew[_j], M[_j][i3]);
            }
            B2.push(bNew);
          }
        }
      }
      return B2.map((x) => new DenseMatrix2({
        data: x.map((e3) => [e3]),
        size: [rows, 1]
      }));
    }
    function _sparseForwardSubstitution(m, b_) {
      var B2 = [solveValidation(m, b_, true)._data.map((e3) => e3[0])];
      var rows = m._size[0];
      var columns = m._size[1];
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      for (var i3 = 0; i3 < columns; i3++) {
        var L = B2.length;
        for (var k = 0; k < L; k++) {
          var b = B2[k];
          var iValues = [];
          var iIndices = [];
          var firstIndex = ptr[i3];
          var lastIndex = ptr[i3 + 1];
          var Mii = 0;
          for (var j = firstIndex; j < lastIndex; j++) {
            var J = index2[j];
            if (J === i3) {
              Mii = values[j];
            } else if (J > i3) {
              iValues.push(values[j]);
              iIndices.push(J);
            }
          }
          if (!equalScalar2(Mii, 0)) {
            b[i3] = divideScalar2(b[i3], Mii);
            for (var _j2 = 0, _lastIndex = iIndices.length; _j2 < _lastIndex; _j2++) {
              var _J = iIndices[_j2];
              b[_J] = subtractScalar2(b[_J], multiplyScalar2(b[i3], iValues[_j2]));
            }
          } else if (!equalScalar2(b[i3], 0)) {
            if (k === 0) {
              return [];
            } else {
              B2.splice(k, 1);
              k -= 1;
              L -= 1;
            }
          } else if (k === 0) {
            var bNew = [...b];
            bNew[i3] = 1;
            for (var _j3 = 0, _lastIndex2 = iIndices.length; _j3 < _lastIndex2; _j3++) {
              var _J2 = iIndices[_j3];
              bNew[_J2] = subtractScalar2(bNew[_J2], iValues[_j3]);
            }
            B2.push(bNew);
          }
        }
      }
      return B2.map((x) => new DenseMatrix2({
        data: x.map((e3) => [e3]),
        size: [rows, 1]
      }));
    }
  });

  // node_modules/mathjs/lib/esm/function/algebra/solver/usolveAll.js
  var name136 = "usolveAll";
  var dependencies136 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
  var createUsolveAll = /* @__PURE__ */ factory(name136, dependencies136, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      divideScalar: divideScalar2,
      multiplyScalar: multiplyScalar2,
      subtractScalar: subtractScalar2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    var solveValidation = createSolveValidation({
      DenseMatrix: DenseMatrix2
    });
    return typed3(name136, {
      "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
        return _sparseBackwardSubstitution(m, b);
      },
      "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
        return _denseBackwardSubstitution(m, b);
      },
      "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
        var m = matrix2(a);
        var R = _denseBackwardSubstitution(m, b);
        return R.map((r) => r.valueOf());
      }
    });
    function _denseBackwardSubstitution(m, b_) {
      var B2 = [solveValidation(m, b_, true)._data.map((e3) => e3[0])];
      var M = m._data;
      var rows = m._size[0];
      var columns = m._size[1];
      for (var i3 = columns - 1; i3 >= 0; i3--) {
        var L = B2.length;
        for (var k = 0; k < L; k++) {
          var b = B2[k];
          if (!equalScalar2(M[i3][i3], 0)) {
            b[i3] = divideScalar2(b[i3], M[i3][i3]);
            for (var j = i3 - 1; j >= 0; j--) {
              b[j] = subtractScalar2(b[j], multiplyScalar2(b[i3], M[j][i3]));
            }
          } else if (!equalScalar2(b[i3], 0)) {
            if (k === 0) {
              return [];
            } else {
              B2.splice(k, 1);
              k -= 1;
              L -= 1;
            }
          } else if (k === 0) {
            var bNew = [...b];
            bNew[i3] = 1;
            for (var _j = i3 - 1; _j >= 0; _j--) {
              bNew[_j] = subtractScalar2(bNew[_j], M[_j][i3]);
            }
            B2.push(bNew);
          }
        }
      }
      return B2.map((x) => new DenseMatrix2({
        data: x.map((e3) => [e3]),
        size: [rows, 1]
      }));
    }
    function _sparseBackwardSubstitution(m, b_) {
      var B2 = [solveValidation(m, b_, true)._data.map((e3) => e3[0])];
      var rows = m._size[0];
      var columns = m._size[1];
      var values = m._values;
      var index2 = m._index;
      var ptr = m._ptr;
      for (var i3 = columns - 1; i3 >= 0; i3--) {
        var L = B2.length;
        for (var k = 0; k < L; k++) {
          var b = B2[k];
          var iValues = [];
          var iIndices = [];
          var firstIndex = ptr[i3];
          var lastIndex = ptr[i3 + 1];
          var Mii = 0;
          for (var j = lastIndex - 1; j >= firstIndex; j--) {
            var J = index2[j];
            if (J === i3) {
              Mii = values[j];
            } else if (J < i3) {
              iValues.push(values[j]);
              iIndices.push(J);
            }
          }
          if (!equalScalar2(Mii, 0)) {
            b[i3] = divideScalar2(b[i3], Mii);
            for (var _j2 = 0, _lastIndex = iIndices.length; _j2 < _lastIndex; _j2++) {
              var _J = iIndices[_j2];
              b[_J] = subtractScalar2(b[_J], multiplyScalar2(b[i3], iValues[_j2]));
            }
          } else if (!equalScalar2(b[i3], 0)) {
            if (k === 0) {
              return [];
            } else {
              B2.splice(k, 1);
              k -= 1;
              L -= 1;
            }
          } else if (k === 0) {
            var bNew = [...b];
            bNew[i3] = 1;
            for (var _j3 = 0, _lastIndex2 = iIndices.length; _j3 < _lastIndex2; _j3++) {
              var _J2 = iIndices[_j3];
              bNew[_J2] = subtractScalar2(bNew[_J2], iValues[_j3]);
            }
            B2.push(bNew);
          }
        }
      }
      return B2.map((x) => new DenseMatrix2({
        data: x.map((e3) => [e3]),
        size: [rows, 1]
      }));
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo08xS0Sid.js
  var name137 = "matAlgo08xS0Sid";
  var dependencies137 = ["typed", "equalScalar"];
  var createMatAlgo08xS0Sid = /* @__PURE__ */ factory(name137, dependencies137, (_ref) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref;
    return function matAlgo08xS0Sid(a, b, callback) {
      var avalues = a._values;
      var aindex = a._index;
      var aptr = a._ptr;
      var asize = a._size;
      var adt = a._datatype;
      var bvalues = b._values;
      var bindex = b._index;
      var bptr = b._ptr;
      var bsize = b._size;
      var bdt = b._datatype;
      if (asize.length !== bsize.length) {
        throw new DimensionError(asize.length, bsize.length);
      }
      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      if (!avalues || !bvalues) {
        throw new Error("Cannot perform operation on Pattern Sparse Matrices");
      }
      var rows = asize[0];
      var columns = asize[1];
      var dt;
      var eq = equalScalar2;
      var zero = 0;
      var cf = callback;
      if (typeof adt === "string" && adt === bdt) {
        dt = adt;
        eq = typed3.find(equalScalar2, [dt, dt]);
        zero = typed3.convert(0, dt);
        cf = typed3.find(callback, [dt, dt]);
      }
      var cvalues = [];
      var cindex = [];
      var cptr = [];
      var x = [];
      var w2 = [];
      var k, k0, k1, i3;
      for (var j = 0; j < columns; j++) {
        cptr[j] = cindex.length;
        var mark = j + 1;
        for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          i3 = aindex[k];
          w2[i3] = mark;
          x[i3] = avalues[k];
          cindex.push(i3);
        }
        for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          i3 = bindex[k];
          if (w2[i3] === mark) {
            x[i3] = cf(x[i3], bvalues[k]);
          }
        }
        k = cptr[j];
        while (k < cindex.length) {
          i3 = cindex[k];
          var v = x[i3];
          if (!eq(v, zero)) {
            cvalues.push(v);
            k++;
          } else {
            cindex.splice(k, 1);
          }
        }
      }
      cptr[columns] = cindex.length;
      return a.createSparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [rows, columns],
        datatype: dt
      });
    };
  });

  // node_modules/mathjs/lib/esm/function/bitwise/useMatrixForArrayScalar.js
  var createUseMatrixForArrayScalar = /* @__PURE__ */ factory("useMatrixForArrayScalar", ["typed", "matrix"], (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2
    } = _ref;
    return {
      "Array, number": typed3.referTo("DenseMatrix, number", (selfDn) => (x, y2) => selfDn(matrix2(x), y2).valueOf()),
      "Array, BigNumber": typed3.referTo("DenseMatrix, BigNumber", (selfDB) => (x, y2) => selfDB(matrix2(x), y2).valueOf()),
      "number, Array": typed3.referTo("number, DenseMatrix", (selfnD) => (x, y2) => selfnD(x, matrix2(y2)).valueOf()),
      "BigNumber, Array": typed3.referTo("BigNumber, DenseMatrix", (selfBD) => (x, y2) => selfBD(x, matrix2(y2)).valueOf())
    };
  });

  // node_modules/mathjs/lib/esm/function/bitwise/leftShift.js
  var name138 = "leftShift";
  var dependencies138 = ["typed", "matrix", "equalScalar", "zeros", "DenseMatrix", "concat"];
  var createLeftShift = /* @__PURE__ */ factory(name138, dependencies138, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo08xS0Sid = createMatAlgo08xS0Sid({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var useMatrixForArrayScalar = createUseMatrixForArrayScalar({
      typed: typed3,
      matrix: matrix2
    });
    return typed3(name138, {
      "number, number": leftShiftNumber,
      "BigNumber, BigNumber": leftShiftBigNumber,
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "number | BigNumber, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo10xSids(y2, x, self2, true);
      }),
      "number | BigNumber, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo14xDs(y2, x, self2, true);
      })
    }, useMatrixForArrayScalar, matrixAlgorithmSuite({
      SS: matAlgo08xS0Sid,
      DS: matAlgo01xDSid,
      SD: matAlgo02xDS0
    }));
  });

  // node_modules/mathjs/lib/esm/function/bitwise/rightArithShift.js
  var name139 = "rightArithShift";
  var dependencies139 = ["typed", "matrix", "equalScalar", "zeros", "DenseMatrix", "concat"];
  var createRightArithShift = /* @__PURE__ */ factory(name139, dependencies139, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo08xS0Sid = createMatAlgo08xS0Sid({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var useMatrixForArrayScalar = createUseMatrixForArrayScalar({
      typed: typed3,
      matrix: matrix2
    });
    return typed3(name139, {
      "number, number": rightArithShiftNumber,
      "BigNumber, BigNumber": rightArithShiftBigNumber,
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "number | BigNumber, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo10xSids(y2, x, self2, true);
      }),
      "number | BigNumber, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo14xDs(y2, x, self2, true);
      })
    }, useMatrixForArrayScalar, matrixAlgorithmSuite({
      SS: matAlgo08xS0Sid,
      DS: matAlgo01xDSid,
      SD: matAlgo02xDS0
    }));
  });

  // node_modules/mathjs/lib/esm/function/bitwise/rightLogShift.js
  var name140 = "rightLogShift";
  var dependencies140 = ["typed", "matrix", "equalScalar", "zeros", "DenseMatrix", "concat"];
  var createRightLogShift = /* @__PURE__ */ factory(name140, dependencies140, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo01xDSid = createMatAlgo01xDSid({
      typed: typed3
    });
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo08xS0Sid = createMatAlgo08xS0Sid({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo10xSids = createMatAlgo10xSids({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var useMatrixForArrayScalar = createUseMatrixForArrayScalar({
      typed: typed3,
      matrix: matrix2
    });
    return typed3(name140, {
      "number, number": rightLogShiftNumber,
      // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift
      "SparseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, number | BigNumber": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(y2, 0)) {
          return x.clone();
        }
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "number | BigNumber, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo10xSids(y2, x, self2, true);
      }),
      "number | BigNumber, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (equalScalar2(x, 0)) {
          return zeros3(y2.size(), y2.storage());
        }
        return matAlgo14xDs(y2, x, self2, true);
      })
    }, useMatrixForArrayScalar, matrixAlgorithmSuite({
      SS: matAlgo08xS0Sid,
      DS: matAlgo01xDSid,
      SD: matAlgo02xDS0
    }));
  });

  // node_modules/mathjs/lib/esm/function/logical/and.js
  var name141 = "and";
  var dependencies141 = ["typed", "matrix", "equalScalar", "zeros", "not", "concat"];
  var createAnd = /* @__PURE__ */ factory(name141, dependencies141, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      zeros: zeros3,
      not: not2,
      concat: concat3
    } = _ref;
    var matAlgo02xDS0 = createMatAlgo02xDS0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo06xS0S0 = createMatAlgo06xS0S0({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo11xS0s = createMatAlgo11xS0s({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo14xDs = createMatAlgo14xDs({
      typed: typed3
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name141, {
      "number, number": andNumber,
      "Complex, Complex": function ComplexComplex(x, y2) {
        return (x.re !== 0 || x.im !== 0) && (y2.re !== 0 || y2.im !== 0);
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return !x.isZero() && !y2.isZero() && !x.isNaN() && !y2.isNaN();
      },
      "Unit, Unit": typed3.referToSelf((self2) => (x, y2) => self2(x.value || 0, y2.value || 0)),
      "SparseMatrix, any": typed3.referToSelf((self2) => (x, y2) => {
        if (not2(y2)) {
          return zeros3(x.size(), x.storage());
        }
        return matAlgo11xS0s(x, y2, self2, false);
      }),
      "DenseMatrix, any": typed3.referToSelf((self2) => (x, y2) => {
        if (not2(y2)) {
          return zeros3(x.size(), x.storage());
        }
        return matAlgo14xDs(x, y2, self2, false);
      }),
      "any, SparseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (not2(x)) {
          return zeros3(x.size(), x.storage());
        }
        return matAlgo11xS0s(y2, x, self2, true);
      }),
      "any, DenseMatrix": typed3.referToSelf((self2) => (x, y2) => {
        if (not2(x)) {
          return zeros3(x.size(), x.storage());
        }
        return matAlgo14xDs(y2, x, self2, true);
      }),
      "Array, any": typed3.referToSelf((self2) => (x, y2) => {
        return self2(matrix2(x), y2).valueOf();
      }),
      "any, Array": typed3.referToSelf((self2) => (x, y2) => {
        return self2(x, matrix2(y2)).valueOf();
      })
    }, matrixAlgorithmSuite({
      SS: matAlgo06xS0S0,
      DS: matAlgo02xDS0
    }));
  });

  // node_modules/mathjs/lib/esm/function/relational/compare.js
  var name142 = "compare";
  var dependencies142 = ["typed", "config", "matrix", "equalScalar", "BigNumber", "Fraction", "DenseMatrix", "concat"];
  var createCompare = /* @__PURE__ */ factory(name142, dependencies142, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      equalScalar: equalScalar2,
      matrix: matrix2,
      BigNumber: BigNumber2,
      Fraction: Fraction3,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo05xSfSf = createMatAlgo05xSfSf({
      typed: typed3,
      equalScalar: equalScalar2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name142, createCompareNumber({
      typed: typed3,
      config: config4
    }), {
      "boolean, boolean": function booleanBoolean(x, y2) {
        return x === y2 ? 0 : x > y2 ? 1 : -1;
      },
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return nearlyEqual2(x, y2, config4.epsilon) ? new BigNumber2(0) : new BigNumber2(x.cmp(y2));
      },
      "Fraction, Fraction": function FractionFraction(x, y2) {
        return new Fraction3(x.compare(y2));
      },
      "Complex, Complex": function ComplexComplex() {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
    }, compareUnits, matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createCompareNumber = /* @__PURE__ */ factory(name142, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name142, {
      "number, number": function numberNumber(x, y2) {
        return nearlyEqual(x, y2, config4.epsilon) ? 0 : x > y2 ? 1 : -1;
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/compareNatural.js
  var import_javascript_natural_sort = __toESM(require_naturalSort(), 1);
  var name143 = "compareNatural";
  var dependencies143 = ["typed", "compare"];
  var createCompareNatural = /* @__PURE__ */ factory(name143, dependencies143, (_ref) => {
    var {
      typed: typed3,
      compare: compare2
    } = _ref;
    var compareBooleans = compare2.signatures["boolean,boolean"];
    return typed3(name143, {
      "any, any": _compareNatural
    });
    function _compareNatural(x, y2) {
      var typeX = typeOf(x);
      var typeY = typeOf(y2);
      var c;
      if ((typeX === "number" || typeX === "BigNumber" || typeX === "Fraction") && (typeY === "number" || typeY === "BigNumber" || typeY === "Fraction")) {
        c = compare2(x, y2);
        if (c.toString() !== "0") {
          return c > 0 ? 1 : -1;
        } else {
          return (0, import_javascript_natural_sort.default)(typeX, typeY);
        }
      }
      var matTypes = ["Array", "DenseMatrix", "SparseMatrix"];
      if (matTypes.includes(typeX) || matTypes.includes(typeY)) {
        c = compareMatricesAndArrays(_compareNatural, x, y2);
        if (c !== 0) {
          return c;
        } else {
          return (0, import_javascript_natural_sort.default)(typeX, typeY);
        }
      }
      if (typeX !== typeY) {
        return (0, import_javascript_natural_sort.default)(typeX, typeY);
      }
      if (typeX === "Complex") {
        return compareComplexNumbers(x, y2);
      }
      if (typeX === "Unit") {
        if (x.equalBase(y2)) {
          return _compareNatural(x.value, y2.value);
        }
        return compareArrays(_compareNatural, x.formatUnits(), y2.formatUnits());
      }
      if (typeX === "boolean") {
        return compareBooleans(x, y2);
      }
      if (typeX === "string") {
        return (0, import_javascript_natural_sort.default)(x, y2);
      }
      if (typeX === "Object") {
        return compareObjects(_compareNatural, x, y2);
      }
      if (typeX === "null") {
        return 0;
      }
      if (typeX === "undefined") {
        return 0;
      }
      throw new TypeError('Unsupported type of value "' + typeX + '"');
    }
    function compareMatricesAndArrays(compareNatural2, x, y2) {
      if (isSparseMatrix(x) && isSparseMatrix(y2)) {
        return compareArrays(compareNatural2, x.toJSON().values, y2.toJSON().values);
      }
      if (isSparseMatrix(x)) {
        return compareMatricesAndArrays(compareNatural2, x.toArray(), y2);
      }
      if (isSparseMatrix(y2)) {
        return compareMatricesAndArrays(compareNatural2, x, y2.toArray());
      }
      if (isDenseMatrix(x)) {
        return compareMatricesAndArrays(compareNatural2, x.toJSON().data, y2);
      }
      if (isDenseMatrix(y2)) {
        return compareMatricesAndArrays(compareNatural2, x, y2.toJSON().data);
      }
      if (!Array.isArray(x)) {
        return compareMatricesAndArrays(compareNatural2, [x], y2);
      }
      if (!Array.isArray(y2)) {
        return compareMatricesAndArrays(compareNatural2, x, [y2]);
      }
      return compareArrays(compareNatural2, x, y2);
    }
    function compareArrays(compareNatural2, x, y2) {
      for (var i3 = 0, ii = Math.min(x.length, y2.length); i3 < ii; i3++) {
        var v = compareNatural2(x[i3], y2[i3]);
        if (v !== 0) {
          return v;
        }
      }
      if (x.length > y2.length) {
        return 1;
      }
      if (x.length < y2.length) {
        return -1;
      }
      return 0;
    }
    function compareObjects(compareNatural2, x, y2) {
      var keysX = Object.keys(x);
      var keysY = Object.keys(y2);
      keysX.sort(import_javascript_natural_sort.default);
      keysY.sort(import_javascript_natural_sort.default);
      var c = compareArrays(compareNatural2, keysX, keysY);
      if (c !== 0) {
        return c;
      }
      for (var i3 = 0; i3 < keysX.length; i3++) {
        var v = compareNatural2(x[keysX[i3]], y2[keysY[i3]]);
        if (v !== 0) {
          return v;
        }
      }
      return 0;
    }
  });
  function compareComplexNumbers(x, y2) {
    if (x.re > y2.re) {
      return 1;
    }
    if (x.re < y2.re) {
      return -1;
    }
    if (x.im > y2.im) {
      return 1;
    }
    if (x.im < y2.im) {
      return -1;
    }
    return 0;
  }

  // node_modules/mathjs/lib/esm/function/relational/compareText.js
  var name144 = "compareText";
  var dependencies144 = ["typed", "matrix", "concat"];
  compareText.signature = "any, any";
  var createCompareText = /* @__PURE__ */ factory(name144, dependencies144, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    } = _ref;
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name144, compareText, matrixAlgorithmSuite({
      elop: compareText,
      Ds: true
    }));
  });

  // node_modules/mathjs/lib/esm/function/relational/equal.js
  var name145 = "equal";
  var dependencies145 = ["typed", "matrix", "equalScalar", "DenseMatrix", "concat"];
  var createEqual = /* @__PURE__ */ factory(name145, dependencies145, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      equalScalar: equalScalar2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name145, createEqualNumber({
      typed: typed3,
      equalScalar: equalScalar2
    }), matrixAlgorithmSuite({
      elop: equalScalar2,
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createEqualNumber = factory(name145, ["typed", "equalScalar"], (_ref2) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref2;
    return typed3(name145, {
      "any, any": function anyAny(x, y2) {
        if (x === null) {
          return y2 === null;
        }
        if (y2 === null) {
          return x === null;
        }
        if (x === void 0) {
          return y2 === void 0;
        }
        if (y2 === void 0) {
          return x === void 0;
        }
        return equalScalar2(x, y2);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/equalText.js
  var name146 = "equalText";
  var dependencies146 = ["typed", "compareText", "isZero"];
  var createEqualText = /* @__PURE__ */ factory(name146, dependencies146, (_ref) => {
    var {
      typed: typed3,
      compareText: compareText3,
      isZero: isZero2
    } = _ref;
    return typed3(name146, {
      "any, any": function anyAny(x, y2) {
        return isZero2(compareText3(x, y2));
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/smaller.js
  var name147 = "smaller";
  var dependencies147 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
  var createSmaller = /* @__PURE__ */ factory(name147, dependencies147, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name147, createSmallerNumber({
      typed: typed3,
      config: config4
    }), {
      "boolean, boolean": (x, y2) => x < y2,
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.lt(y2) && !nearlyEqual2(x, y2, config4.epsilon);
      },
      "Fraction, Fraction": (x, y2) => x.compare(y2) === -1,
      "Complex, Complex": function ComplexComplex(x, y2) {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
    }, compareUnits, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createSmallerNumber = /* @__PURE__ */ factory(name147, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name147, {
      "number, number": function numberNumber(x, y2) {
        return x < y2 && !nearlyEqual(x, y2, config4.epsilon);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/smallerEq.js
  var name148 = "smallerEq";
  var dependencies148 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
  var createSmallerEq = /* @__PURE__ */ factory(name148, dependencies148, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name148, createSmallerEqNumber({
      typed: typed3,
      config: config4
    }), {
      "boolean, boolean": (x, y2) => x <= y2,
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.lte(y2) || nearlyEqual2(x, y2, config4.epsilon);
      },
      "Fraction, Fraction": (x, y2) => x.compare(y2) !== 1,
      "Complex, Complex": function ComplexComplex() {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
    }, compareUnits, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createSmallerEqNumber = /* @__PURE__ */ factory(name148, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name148, {
      "number, number": function numberNumber(x, y2) {
        return x <= y2 || nearlyEqual(x, y2, config4.epsilon);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/larger.js
  var name149 = "larger";
  var dependencies149 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
  var createLarger = /* @__PURE__ */ factory(name149, dependencies149, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name149, createLargerNumber({
      typed: typed3,
      config: config4
    }), {
      "boolean, boolean": (x, y2) => x > y2,
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.gt(y2) && !nearlyEqual2(x, y2, config4.epsilon);
      },
      "Fraction, Fraction": (x, y2) => x.compare(y2) === 1,
      "Complex, Complex": function ComplexComplex() {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
    }, compareUnits, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createLargerNumber = /* @__PURE__ */ factory(name149, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name149, {
      "number, number": function numberNumber(x, y2) {
        return x > y2 && !nearlyEqual(x, y2, config4.epsilon);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/largerEq.js
  var name150 = "largerEq";
  var dependencies150 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
  var createLargerEq = /* @__PURE__ */ factory(name150, dependencies150, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    var compareUnits = createCompareUnits({
      typed: typed3
    });
    return typed3(name150, createLargerEqNumber({
      typed: typed3,
      config: config4
    }), {
      "boolean, boolean": (x, y2) => x >= y2,
      "BigNumber, BigNumber": function BigNumberBigNumber(x, y2) {
        return x.gte(y2) || nearlyEqual2(x, y2, config4.epsilon);
      },
      "Fraction, Fraction": (x, y2) => x.compare(y2) !== -1,
      "Complex, Complex": function ComplexComplex() {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
    }, compareUnits, matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
  });
  var createLargerEqNumber = /* @__PURE__ */ factory(name150, ["typed", "config"], (_ref2) => {
    var {
      typed: typed3,
      config: config4
    } = _ref2;
    return typed3(name150, {
      "number, number": function numberNumber(x, y2) {
        return x >= y2 || nearlyEqual(x, y2, config4.epsilon);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/relational/deepEqual.js
  var name151 = "deepEqual";
  var dependencies151 = ["typed", "equal"];
  var createDeepEqual = /* @__PURE__ */ factory(name151, dependencies151, (_ref) => {
    var {
      typed: typed3,
      equal: equal2
    } = _ref;
    return typed3(name151, {
      "any, any": function anyAny(x, y2) {
        return _deepEqual(x.valueOf(), y2.valueOf());
      }
    });
    function _deepEqual(x, y2) {
      if (Array.isArray(x)) {
        if (Array.isArray(y2)) {
          var len = x.length;
          if (len !== y2.length) {
            return false;
          }
          for (var i3 = 0; i3 < len; i3++) {
            if (!_deepEqual(x[i3], y2[i3])) {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      } else {
        if (Array.isArray(y2)) {
          return false;
        } else {
          return equal2(x, y2);
        }
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/relational/unequal.js
  var name152 = "unequal";
  var dependencies152 = ["typed", "config", "equalScalar", "matrix", "DenseMatrix", "concat"];
  var createUnequal = /* @__PURE__ */ factory(name152, dependencies152, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      equalScalar: equalScalar2,
      matrix: matrix2,
      DenseMatrix: DenseMatrix2,
      concat: concat3
    } = _ref;
    var matAlgo03xDSf = createMatAlgo03xDSf({
      typed: typed3
    });
    var matAlgo07xSSf = createMatAlgo07xSSf({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matAlgo12xSfs = createMatAlgo12xSfs({
      typed: typed3,
      DenseMatrix: DenseMatrix2
    });
    var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
      typed: typed3,
      matrix: matrix2,
      concat: concat3
    });
    return typed3(name152, createUnequalNumber({
      typed: typed3,
      equalScalar: equalScalar2
    }), matrixAlgorithmSuite({
      elop: _unequal,
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    }));
    function _unequal(x, y2) {
      return !equalScalar2(x, y2);
    }
  });
  var createUnequalNumber = factory(name152, ["typed", "equalScalar"], (_ref2) => {
    var {
      typed: typed3,
      equalScalar: equalScalar2
    } = _ref2;
    return typed3(name152, {
      "any, any": function anyAny(x, y2) {
        if (x === null) {
          return y2 !== null;
        }
        if (y2 === null) {
          return x !== null;
        }
        if (x === void 0) {
          return y2 !== void 0;
        }
        if (y2 === void 0) {
          return x !== void 0;
        }
        return !equalScalar2(x, y2);
      }
    });
  });

  // node_modules/mathjs/lib/esm/function/matrix/partitionSelect.js
  var name153 = "partitionSelect";
  var dependencies153 = ["typed", "isNumeric", "isNaN", "compare"];
  var createPartitionSelect = /* @__PURE__ */ factory(name153, dependencies153, (_ref) => {
    var {
      typed: typed3,
      isNumeric: isNumeric2,
      isNaN: isNaN3,
      compare: compare2
    } = _ref;
    var asc = compare2;
    var desc = (a, b) => -compare2(a, b);
    return typed3(name153, {
      "Array | Matrix, number": function ArrayMatrixNumber(x, k) {
        return _partitionSelect(x, k, asc);
      },
      "Array | Matrix, number, string": function ArrayMatrixNumberString(x, k, compare3) {
        if (compare3 === "asc") {
          return _partitionSelect(x, k, asc);
        } else if (compare3 === "desc") {
          return _partitionSelect(x, k, desc);
        } else {
          throw new Error('Compare string must be "asc" or "desc"');
        }
      },
      "Array | Matrix, number, function": _partitionSelect
    });
    function _partitionSelect(x, k, compare3) {
      if (!isInteger(k) || k < 0) {
        throw new Error("k must be a non-negative integer");
      }
      if (isMatrix(x)) {
        var size2 = x.size();
        if (size2.length > 1) {
          throw new Error("Only one dimensional matrices supported");
        }
        return quickSelect(x.valueOf(), k, compare3);
      }
      if (Array.isArray(x)) {
        return quickSelect(x, k, compare3);
      }
    }
    function quickSelect(arr, k, compare3) {
      if (k >= arr.length) {
        throw new Error("k out of bounds");
      }
      for (var i3 = 0; i3 < arr.length; i3++) {
        if (isNumeric2(arr[i3]) && isNaN3(arr[i3])) {
          return arr[i3];
        }
      }
      var from = 0;
      var to2 = arr.length - 1;
      while (from < to2) {
        var r = from;
        var w2 = to2;
        var pivot = arr[Math.floor(Math.random() * (to2 - from + 1)) + from];
        while (r < w2) {
          if (compare3(arr[r], pivot) >= 0) {
            var tmp = arr[w2];
            arr[w2] = arr[r];
            arr[r] = tmp;
            --w2;
          } else {
            ++r;
          }
        }
        if (compare3(arr[r], pivot) > 0) {
          --r;
        }
        if (k <= r) {
          to2 = r;
        } else {
          from = r + 1;
        }
      }
      return arr[k];
    }
  });

  // node_modules/mathjs/lib/esm/function/matrix/sort.js
  var name154 = "sort";
  var dependencies154 = ["typed", "matrix", "compare", "compareNatural"];
  var createSort = /* @__PURE__ */ factory(name154, dependencies154, (_ref) => {
    var {
      typed: typed3,
      matrix: matrix2,
      compare: compare2,
      compareNatural: compareNatural2
    } = _ref;
    var compareAsc = compare2;
    var compareDesc = (a, b) => -compare2(a, b);
    return typed3(name154, {
      Array: function Array2(x) {
        _arrayIsVector(x);
        return x.sort(compareAsc);
      },
      Matrix: function Matrix2(x) {
        _matrixIsVector(x);
        return matrix2(x.toArray().sort(compareAsc), x.storage());
      },
      "Array, function": function ArrayFunction(x, _comparator2) {
        _arrayIsVector(x);
        return x.sort(_comparator2);
      },
      "Matrix, function": function MatrixFunction(x, _comparator2) {
        _matrixIsVector(x);
        return matrix2(x.toArray().sort(_comparator2), x.storage());
      },
      "Array, string": function ArrayString(x, order) {
        _arrayIsVector(x);
        return x.sort(_comparator(order));
      },
      "Matrix, string": function MatrixString(x, order) {
        _matrixIsVector(x);
        return matrix2(x.toArray().sort(_comparator(order)), x.storage());
      }
    });
    function _comparator(order) {
      if (order === "asc") {
        return compareAsc;
      } else if (order === "desc") {
        return compareDesc;
      } else if (order === "natural") {
        return compareNatural2;
      } else {
        throw new Error('String "asc", "desc", or "natural" expected');
      }
    }
    function _arrayIsVector(array) {
      if (arraySize(array).length !== 1) {
        throw new Error("One dimensional array expected");
      }
    }
    function _matrixIsVector(matrix3) {
      if (matrix3.size().length !== 1) {
        throw new Error("One dimensional matrix expected");
      }
    }
  });

  // node_modules/mathjs/lib/esm/function/statistics/max.js
  var name155 = "max";
  var dependencies155 = ["typed", "config", "numeric", "larger"];
  var createMax = /* @__PURE__ */ factory(name155, dependencies155, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      numeric: numeric3,
      larger: larger2
    } = _ref;
    return typed3(name155, {
      // max([a, b, c, d, ...])
      "Array | Matrix": _max,
      // max([a, b, c, d, ...], dim)
      "Array | Matrix, number | BigNumber": function ArrayMatrixNumberBigNumber(array, dim) {
        return reduce(array, dim.valueOf(), _largest);
      },
      // max(a, b, c, d, ...)
      "...": function _(args) {
        if (containsCollections(args)) {
          throw new TypeError("Scalar values expected in function max");
        }
        return _max(args);
      }
    });
    function _largest(x, y2) {
      try {
        return larger2(x, y2) ? x : y2;
      } catch (err) {
        throw improveErrorMessage(err, "max", y2);
      }
    }
    function _max(array) {
      var res;
      deepForEach(array, function(value) {
        try {
          if (isNaN(value) && typeof value === "number") {
            res = NaN;
          } else if (res === void 0 || larger2(value, res)) {
            res = value;
          }
        } catch (err) {
          throw improveErrorMessage(err, "max", value);
        }
      });
      if (res === void 0) {
        throw new Error("Cannot calculate max of an empty array");
      }
      if (typeof res === "string") {
        res = numeric3(res, config4.number);
      }
      return res;
    }
  });

  // node_modules/mathjs/lib/esm/function/statistics/min.js
  var name156 = "min";
  var dependencies156 = ["typed", "config", "numeric", "smaller"];
  var createMin = /* @__PURE__ */ factory(name156, dependencies156, (_ref) => {
    var {
      typed: typed3,
      config: config4,
      numeric: numeric3,
      smaller: smaller2
    } = _ref;
    return typed3(name156, {
      // min([a, b, c, d, ...])
      "Array | Matrix": _min,
      // min([a, b, c, d, ...], dim)
      "Array | Matrix, number | BigNumber": function ArrayMatrixNumberBigNumber(array, dim) {
        return reduce(array, dim.valueOf(), _smallest);
      },
      // min(a, b, c, d, ...)
      "...": function _(args) {
        if (containsCollections(args)) {
          throw new TypeError("Scalar values expected in function min");
        }
        return _min(args);
      }
    });
    function _smallest(x, y2) {
      try {
        return smaller2(x, y2) ? x : y2;
      } catch (err) {
        throw improveErrorMessage(err, "min", y2);
      }
    }
    function _min(array) {
      var min3;
      deepForEach(array, function(value) {
        try {
          if (isNaN(value) && typeof value === "number") {
            min3 = NaN;
          } else if (min3 === void 0 || smaller2(value, min3)) {
            min3 = value;
          }
        } catch (err) {
          throw improveErrorMessage(err, "min", value);
        }
      });
      if (min3 === void 0) {
        throw new Error("Cannot calculate min of an empty array");
      }
      if (typeof min3 === "string") {
        min3 = numeric3(min3, config4.number);
      }
      return min3;
    }
  });

  // node_modules/mathjs/lib/esm/type/matrix/ImmutableDenseMatrix.js
  var name157 = "ImmutableDenseMatrix";
  var dependencies157 = ["smaller", "DenseMatrix"];
  var createImmutableDenseMatrixClass = /* @__PURE__ */ factory(name157, dependencies157, (_ref) => {
    var {
      smaller: smaller2,
      DenseMatrix: DenseMatrix2
    } = _ref;
    function ImmutableDenseMatrix2(data, datatype) {
      if (!(this instanceof ImmutableDenseMatrix2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      if (datatype && !isString(datatype)) {
        throw new Error("Invalid datatype: " + datatype);
      }
      if (isMatrix(data) || isArray(data)) {
        var matrix2 = new DenseMatrix2(data, datatype);
        this._data = matrix2._data;
        this._size = matrix2._size;
        this._datatype = matrix2._datatype;
        this._min = null;
        this._max = null;
      } else if (data && isArray(data.data) && isArray(data.size)) {
        this._data = data.data;
        this._size = data.size;
        this._datatype = data.datatype;
        this._min = typeof data.min !== "undefined" ? data.min : null;
        this._max = typeof data.max !== "undefined" ? data.max : null;
      } else if (data) {
        throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
      } else {
        this._data = [];
        this._size = [0];
        this._datatype = datatype;
        this._min = null;
        this._max = null;
      }
    }
    ImmutableDenseMatrix2.prototype = new DenseMatrix2();
    ImmutableDenseMatrix2.prototype.type = "ImmutableDenseMatrix";
    ImmutableDenseMatrix2.prototype.isImmutableDenseMatrix = true;
    ImmutableDenseMatrix2.prototype.subset = function(index2) {
      switch (arguments.length) {
        case 1: {
          var m = DenseMatrix2.prototype.subset.call(this, index2);
          if (isMatrix(m)) {
            return new ImmutableDenseMatrix2({
              data: m._data,
              size: m._size,
              datatype: m._datatype
            });
          }
          return m;
        }
        case 2:
        case 3:
          throw new Error("Cannot invoke set subset on an Immutable Matrix instance");
        default:
          throw new SyntaxError("Wrong number of arguments");
      }
    };
    ImmutableDenseMatrix2.prototype.set = function() {
      throw new Error("Cannot invoke set on an Immutable Matrix instance");
    };
    ImmutableDenseMatrix2.prototype.resize = function() {
      throw new Error("Cannot invoke resize on an Immutable Matrix instance");
    };
    ImmutableDenseMatrix2.prototype.reshape = function() {
      throw new Error("Cannot invoke reshape on an Immutable Matrix instance");
    };
    ImmutableDenseMatrix2.prototype.clone = function() {
      return new ImmutableDenseMatrix2({
        data: clone(this._data),
        size: clone(this._size),
        datatype: this._datatype
      });
    };
    ImmutableDenseMatrix2.prototype.toJSON = function() {
      return {
        mathjs: "ImmutableDenseMatrix",
        data: this._data,
        size: this._size,
        datatype: this._datatype
      };
    };
    ImmutableDenseMatrix2.fromJSON = function(json) {
      return new ImmutableDenseMatrix2(json);
    };
    ImmutableDenseMatrix2.prototype.swapRows = function() {
      throw new Error("Cannot invoke swapRows on an Immutable Matrix instance");
    };
    ImmutableDenseMatrix2.prototype.min = function() {
      if (this._min === null) {
        var m = null;
        this.forEach(function(v) {
          if (m === null || smaller2(v, m)) {
            m = v;
          }
        });
        this._min = m !== null ? m : void 0;
      }
      return this._min;
    };
    ImmutableDenseMatrix2.prototype.max = function() {
      if (this._max === null) {
        var m = null;
        this.forEach(function(v) {
          if (m === null || smaller2(m, v)) {
            m = v;
          }
        });
        this._max = m !== null ? m : void 0;
      }
      return this._max;
    };
    return ImmutableDenseMatrix2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/matrix/MatrixIndex.js
  var name158 = "Index";
  var dependencies158 = ["ImmutableDenseMatrix", "getMatrixDataType"];
  var createIndexClass = /* @__PURE__ */ factory(name158, dependencies158, (_ref) => {
    var {
      ImmutableDenseMatrix: ImmutableDenseMatrix2,
      getMatrixDataType: getMatrixDataType2
    } = _ref;
    function Index2(ranges) {
      if (!(this instanceof Index2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      this._dimensions = [];
      this._sourceSize = [];
      this._isScalar = true;
      for (var i3 = 0, ii = arguments.length; i3 < ii; i3++) {
        var arg2 = arguments[i3];
        var argIsArray = isArray(arg2);
        var argIsMatrix = isMatrix(arg2);
        var sourceSize = null;
        if (isRange(arg2)) {
          this._dimensions.push(arg2);
          this._isScalar = false;
        } else if (argIsArray || argIsMatrix) {
          var m = void 0;
          if (getMatrixDataType2(arg2) === "boolean") {
            if (argIsArray)
              m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg2).valueOf());
            if (argIsMatrix)
              m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg2._data).valueOf());
            sourceSize = arg2.valueOf().length;
          } else {
            m = _createImmutableMatrix(arg2.valueOf());
          }
          this._dimensions.push(m);
          var size2 = m.size();
          if (size2.length !== 1 || size2[0] !== 1 || sourceSize !== null) {
            this._isScalar = false;
          }
        } else if (typeof arg2 === "number") {
          this._dimensions.push(_createImmutableMatrix([arg2]));
        } else if (typeof arg2 === "string") {
          this._dimensions.push(arg2);
        } else {
          throw new TypeError("Dimension must be an Array, Matrix, number, string, or Range");
        }
        this._sourceSize.push(sourceSize);
      }
    }
    Index2.prototype.type = "Index";
    Index2.prototype.isIndex = true;
    function _createImmutableMatrix(arg2) {
      for (var i3 = 0, l = arg2.length; i3 < l; i3++) {
        if (typeof arg2[i3] !== "number" || !isInteger(arg2[i3])) {
          throw new TypeError("Index parameters must be positive integer numbers");
        }
      }
      return new ImmutableDenseMatrix2(arg2);
    }
    Index2.prototype.clone = function() {
      var index2 = new Index2();
      index2._dimensions = clone(this._dimensions);
      index2._isScalar = this._isScalar;
      index2._sourceSize = this._sourceSize;
      return index2;
    };
    Index2.create = function(ranges) {
      var index2 = new Index2();
      Index2.apply(index2, ranges);
      return index2;
    };
    Index2.prototype.size = function() {
      var size2 = [];
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        var d = this._dimensions[i3];
        size2[i3] = typeof d === "string" ? 1 : d.size()[0];
      }
      return size2;
    };
    Index2.prototype.max = function() {
      var values = [];
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        var range2 = this._dimensions[i3];
        values[i3] = typeof range2 === "string" ? range2 : range2.max();
      }
      return values;
    };
    Index2.prototype.min = function() {
      var values = [];
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        var range2 = this._dimensions[i3];
        values[i3] = typeof range2 === "string" ? range2 : range2.min();
      }
      return values;
    };
    Index2.prototype.forEach = function(callback) {
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        callback(this._dimensions[i3], i3, this);
      }
    };
    Index2.prototype.dimension = function(dim) {
      return this._dimensions[dim] || null;
    };
    Index2.prototype.isObjectProperty = function() {
      return this._dimensions.length === 1 && typeof this._dimensions[0] === "string";
    };
    Index2.prototype.getObjectProperty = function() {
      return this.isObjectProperty() ? this._dimensions[0] : null;
    };
    Index2.prototype.isScalar = function() {
      return this._isScalar;
    };
    Index2.prototype.toArray = function() {
      var array = [];
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        var dimension = this._dimensions[i3];
        array.push(typeof dimension === "string" ? dimension : dimension.toArray());
      }
      return array;
    };
    Index2.prototype.valueOf = Index2.prototype.toArray;
    Index2.prototype.toString = function() {
      var strings = [];
      for (var i3 = 0, ii = this._dimensions.length; i3 < ii; i3++) {
        var dimension = this._dimensions[i3];
        if (typeof dimension === "string") {
          strings.push(JSON.stringify(dimension));
        } else {
          strings.push(dimension.toString());
        }
      }
      return "[" + strings.join(", ") + "]";
    };
    Index2.prototype.toJSON = function() {
      return {
        mathjs: "Index",
        dimensions: this._dimensions
      };
    };
    Index2.fromJSON = function(json) {
      return Index2.create(json.dimensions);
    };
    return Index2;
  }, {
    isClass: true
  });
  function _booleansArrayToNumbersForIndex(booleanArrayIndex) {
    var indexOfNumbers = [];
    booleanArrayIndex.forEach((bool, idx) => {
      if (bool) {
        indexOfNumbers.push(idx);
      }
    });
    return indexOfNumbers;
  }

  // node_modules/mathjs/lib/esm/type/matrix/FibonacciHeap.js
  var name159 = "FibonacciHeap";
  var dependencies159 = ["smaller", "larger"];
  var createFibonacciHeapClass = /* @__PURE__ */ factory(name159, dependencies159, (_ref) => {
    var {
      smaller: smaller2,
      larger: larger2
    } = _ref;
    var oneOverLogPhi = 1 / Math.log((1 + Math.sqrt(5)) / 2);
    function FibonacciHeap2() {
      if (!(this instanceof FibonacciHeap2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      this._minimum = null;
      this._size = 0;
    }
    FibonacciHeap2.prototype.type = "FibonacciHeap";
    FibonacciHeap2.prototype.isFibonacciHeap = true;
    FibonacciHeap2.prototype.insert = function(key, value) {
      var node = {
        key,
        value,
        degree: 0
      };
      if (this._minimum) {
        var minimum = this._minimum;
        node.left = minimum;
        node.right = minimum.right;
        minimum.right = node;
        node.right.left = node;
        if (smaller2(key, minimum.key)) {
          this._minimum = node;
        }
      } else {
        node.left = node;
        node.right = node;
        this._minimum = node;
      }
      this._size++;
      return node;
    };
    FibonacciHeap2.prototype.size = function() {
      return this._size;
    };
    FibonacciHeap2.prototype.clear = function() {
      this._minimum = null;
      this._size = 0;
    };
    FibonacciHeap2.prototype.isEmpty = function() {
      return this._size === 0;
    };
    FibonacciHeap2.prototype.extractMinimum = function() {
      var node = this._minimum;
      if (node === null) {
        return node;
      }
      var minimum = this._minimum;
      var numberOfChildren = node.degree;
      var x = node.child;
      while (numberOfChildren > 0) {
        var tempRight = x.right;
        x.left.right = x.right;
        x.right.left = x.left;
        x.left = minimum;
        x.right = minimum.right;
        minimum.right = x;
        x.right.left = x;
        x.parent = null;
        x = tempRight;
        numberOfChildren--;
      }
      node.left.right = node.right;
      node.right.left = node.left;
      if (node === node.right) {
        minimum = null;
      } else {
        minimum = node.right;
        minimum = _findMinimumNode(minimum, this._size);
      }
      this._size--;
      this._minimum = minimum;
      return node;
    };
    FibonacciHeap2.prototype.remove = function(node) {
      this._minimum = _decreaseKey(this._minimum, node, -1);
      this.extractMinimum();
    };
    function _decreaseKey(minimum, node, key) {
      node.key = key;
      var parent = node.parent;
      if (parent && smaller2(node.key, parent.key)) {
        _cut(minimum, node, parent);
        _cascadingCut(minimum, parent);
      }
      if (smaller2(node.key, minimum.key)) {
        minimum = node;
      }
      return minimum;
    }
    function _cut(minimum, node, parent) {
      node.left.right = node.right;
      node.right.left = node.left;
      parent.degree--;
      if (parent.child === node) {
        parent.child = node.right;
      }
      if (parent.degree === 0) {
        parent.child = null;
      }
      node.left = minimum;
      node.right = minimum.right;
      minimum.right = node;
      node.right.left = node;
      node.parent = null;
      node.mark = false;
    }
    function _cascadingCut(minimum, node) {
      var parent = node.parent;
      if (!parent) {
        return;
      }
      if (!node.mark) {
        node.mark = true;
      } else {
        _cut(minimum, node, parent);
        _cascadingCut(parent);
      }
    }
    var _linkNodes = function _linkNodes2(node, parent) {
      node.left.right = node.right;
      node.right.left = node.left;
      node.parent = parent;
      if (!parent.child) {
        parent.child = node;
        node.right = node;
        node.left = node;
      } else {
        node.left = parent.child;
        node.right = parent.child.right;
        parent.child.right = node;
        node.right.left = node;
      }
      parent.degree++;
      node.mark = false;
    };
    function _findMinimumNode(minimum, size2) {
      var arraySize2 = Math.floor(Math.log(size2) * oneOverLogPhi) + 1;
      var array = new Array(arraySize2);
      var numRoots = 0;
      var x = minimum;
      if (x) {
        numRoots++;
        x = x.right;
        while (x !== minimum) {
          numRoots++;
          x = x.right;
        }
      }
      var y2;
      while (numRoots > 0) {
        var d = x.degree;
        var next = x.right;
        while (true) {
          y2 = array[d];
          if (!y2) {
            break;
          }
          if (larger2(x.key, y2.key)) {
            var temp = y2;
            y2 = x;
            x = temp;
          }
          _linkNodes(y2, x);
          array[d] = null;
          d++;
        }
        array[d] = x;
        x = next;
        numRoots--;
      }
      minimum = null;
      for (var i3 = 0; i3 < arraySize2; i3++) {
        y2 = array[i3];
        if (!y2) {
          continue;
        }
        if (minimum) {
          y2.left.right = y2.right;
          y2.right.left = y2.left;
          y2.left = minimum;
          y2.right = minimum.right;
          minimum.right = y2;
          y2.right.left = y2;
          if (smaller2(y2.key, minimum.key)) {
            minimum = y2;
          }
        } else {
          minimum = y2;
        }
      }
      return minimum;
    }
    return FibonacciHeap2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/type/matrix/Spa.js
  var name160 = "Spa";
  var dependencies160 = ["addScalar", "equalScalar", "FibonacciHeap"];
  var createSpaClass = /* @__PURE__ */ factory(name160, dependencies160, (_ref) => {
    var {
      addScalar: addScalar2,
      equalScalar: equalScalar2,
      FibonacciHeap: FibonacciHeap2
    } = _ref;
    function Spa2() {
      if (!(this instanceof Spa2)) {
        throw new SyntaxError("Constructor must be called with the new operator");
      }
      this._values = [];
      this._heap = new FibonacciHeap2();
    }
    Spa2.prototype.type = "Spa";
    Spa2.prototype.isSpa = true;
    Spa2.prototype.set = function(i3, v) {
      if (!this._values[i3]) {
        var node = this._heap.insert(i3, v);
        this._values[i3] = node;
      } else {
        this._values[i3].value = v;
      }
    };
    Spa2.prototype.get = function(i3) {
      var node = this._values[i3];
      if (node) {
        return node.value;
      }
      return 0;
    };
    Spa2.prototype.accumulate = function(i3, v) {
      var node = this._values[i3];
      if (!node) {
        node = this._heap.insert(i3, v);
        this._values[i3] = node;
      } else {
        node.value = addScalar2(node.value, v);
      }
    };
    Spa2.prototype.forEach = function(from, to2, callback) {
      var heap = this._heap;
      var values = this._values;
      var nodes = [];
      var node = heap.extractMinimum();
      if (node) {
        nodes.push(node);
      }
      while (node && node.key <= to2) {
        if (node.key >= from) {
          if (!equalScalar2(node.value, 0)) {
            callback(node.key, node.value, this);
          }
        }
        node = heap.extractMinimum();
        if (node) {
          nodes.push(node);
        }
      }
      for (var i3 = 0; i3 < nodes.length; i3++) {
        var n = nodes[i3];
        node = heap.insert(n.key, n.value);
        values[node.key] = node;
      }
    };
    Spa2.prototype.swap = function(i3, j) {
      var nodei = this._values[i3];
      var nodej = this._values[j];
      if (!nodei && nodej) {
        nodei = this._heap.insert(i3, nodej.value);
        this._heap.remove(nodej);
        this._values[i3] = nodei;
        this._values[j] = void 0;
      } else if (nodei && !nodej) {
        nodej = this._heap.insert(j, nodei.value);
        this._heap.remove(nodei);
        this._values[j] = nodej;
        this._values[i3] = void 0;
      } else if (nodei && nodej) {
        var v = nodei.value;
        nodei.value = nodej.value;
        nodej.value = v;
      }
    };
    return Spa2;
  }, {
    isClass: true
  });

  // node_modules/mathjs/lib/esm/utils/bignumber/constants.js
  var createBigNumberE = memoize(function(BigNumber2) {
    return new BigNumber2(1).exp();
  }, {
    hasher
  });
  var createBigNumberPhi = memoize(function(BigNumber2) {
    return new BigNumber2(1).plus(new BigNumber2(5).sqrt()).div(2);
  }, {
    hasher
  });
  var createBigNumberPi = memoize(function(BigNumber2) {
    return BigNumber2.acos(-1);
  }, {
    hasher
  });
  var createBigNumberTau = memoize(function(BigNumber2) {
    return createBigNumberPi(BigNumber2).times(2);
  }, {
    hasher
  });
  function hasher(args) {
    return args[0].precision;
  }

  // node_modules/mathjs/lib/esm/type/unit/Unit.js
  function ownKeys2(e3, r) {
    var t = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e3);
      r && (o2 = o2.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e3, r2).enumerable;
      })), t.push.apply(t, o2);
    }
    return t;
  }
  function _objectSpread2(e3) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
        _defineProperty(e3, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
        Object.defineProperty(e3, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e3;
  }
  var name161 = "Unit";
  var dependencies161 = ["?on", "config", "addScalar", "subtractScalar", "multiplyScalar", "divideScalar", "pow", "abs", "fix", "round", "equal", "isNumeric", "format", "number", "Complex", "BigNumber", "Fraction"];
  var createUnitClass = /* @__PURE__ */ factory(name161, dependencies161, (_ref) => {
    var {
      on,
      config: config4,
      addScalar: addScalar2,
      subtractScalar: subtractScalar2,
      multiplyScalar: multiplyScalar2,
      divideScalar: divideScalar2,
      pow: pow3,
      abs: abs3,
      fix: fix2,
      round: round3,
      equal: equal2,
      isNumeric: isNumeric2,
      format: format5,
      number: _number,
      Complex: Complex3,
      BigNumber: _BigNumber,
      Fraction: _Fraction
    } = _ref;
    var toNumber = _number;
    function Unit2(value, valuelessUnit) {
      if (!(this instanceof Unit2)) {
        throw new Error("Constructor must be called with the new operator");
      }
      if (!(value === null || value === void 0 || isNumeric2(value) || isComplex(value))) {
        throw new TypeError("First parameter in Unit constructor must be number, BigNumber, Fraction, Complex, or undefined");
      }
      this.fixPrefix = false;
      this.skipAutomaticSimplification = true;
      if (valuelessUnit === void 0) {
        this.units = [];
        this.dimensions = BASE_DIMENSIONS.map((x) => 0);
      } else if (typeof valuelessUnit === "string") {
        var u = Unit2.parse(valuelessUnit);
        this.units = u.units;
        this.dimensions = u.dimensions;
      } else if (isUnit(valuelessUnit) && valuelessUnit.value === null) {
        this.fixPrefix = valuelessUnit.fixPrefix;
        this.skipAutomaticSimplification = valuelessUnit.skipAutomaticSimplification;
        this.dimensions = valuelessUnit.dimensions.slice(0);
        this.units = valuelessUnit.units.map((u2) => _extends({}, u2));
      } else {
        throw new TypeError("Second parameter in Unit constructor must be a string or valueless Unit");
      }
      this.value = this._normalize(value);
    }
    Object.defineProperty(Unit2, "name", {
      value: "Unit"
    });
    Unit2.prototype.constructor = Unit2;
    Unit2.prototype.type = "Unit";
    Unit2.prototype.isUnit = true;
    var text, index2, c;
    function skipWhitespace() {
      while (c === " " || c === "	") {
        next();
      }
    }
    function isDigitDot(c2) {
      return c2 >= "0" && c2 <= "9" || c2 === ".";
    }
    function isDigit(c2) {
      return c2 >= "0" && c2 <= "9";
    }
    function next() {
      index2++;
      c = text.charAt(index2);
    }
    function revert(oldIndex) {
      index2 = oldIndex;
      c = text.charAt(index2);
    }
    function parseNumber() {
      var number2 = "";
      var oldIndex = index2;
      if (c === "+") {
        next();
      } else if (c === "-") {
        number2 += c;
        next();
      }
      if (!isDigitDot(c)) {
        revert(oldIndex);
        return null;
      }
      if (c === ".") {
        number2 += c;
        next();
        if (!isDigit(c)) {
          revert(oldIndex);
          return null;
        }
      } else {
        while (isDigit(c)) {
          number2 += c;
          next();
        }
        if (c === ".") {
          number2 += c;
          next();
        }
      }
      while (isDigit(c)) {
        number2 += c;
        next();
      }
      if (c === "E" || c === "e") {
        var tentativeNumber = "";
        var tentativeIndex = index2;
        tentativeNumber += c;
        next();
        if (c === "+" || c === "-") {
          tentativeNumber += c;
          next();
        }
        if (!isDigit(c)) {
          revert(tentativeIndex);
          return number2;
        }
        number2 = number2 + tentativeNumber;
        while (isDigit(c)) {
          number2 += c;
          next();
        }
      }
      return number2;
    }
    function parseUnit() {
      var unitName = "";
      while (isDigit(c) || Unit2.isValidAlpha(c)) {
        unitName += c;
        next();
      }
      var firstC = unitName.charAt(0);
      if (Unit2.isValidAlpha(firstC)) {
        return unitName;
      } else {
        return null;
      }
    }
    function parseCharacter(toFind) {
      if (c === toFind) {
        next();
        return toFind;
      } else {
        return null;
      }
    }
    Unit2.parse = function(str, options) {
      options = options || {};
      text = str;
      index2 = -1;
      c = "";
      if (typeof text !== "string") {
        throw new TypeError("Invalid argument in Unit.parse, string expected");
      }
      var unit3 = new Unit2();
      unit3.units = [];
      var powerMultiplierCurrent = 1;
      var expectingUnit = false;
      next();
      skipWhitespace();
      var valueStr = parseNumber();
      var value = null;
      if (valueStr) {
        if (config4.number === "BigNumber") {
          value = new _BigNumber(valueStr);
        } else if (config4.number === "Fraction") {
          try {
            value = new _Fraction(valueStr);
          } catch (err) {
            value = parseFloat(valueStr);
          }
        } else {
          value = parseFloat(valueStr);
        }
        skipWhitespace();
        if (parseCharacter("*")) {
          powerMultiplierCurrent = 1;
          expectingUnit = true;
        } else if (parseCharacter("/")) {
          powerMultiplierCurrent = -1;
          expectingUnit = true;
        }
      }
      var powerMultiplierStack = [];
      var powerMultiplierStackProduct = 1;
      while (true) {
        skipWhitespace();
        while (c === "(") {
          powerMultiplierStack.push(powerMultiplierCurrent);
          powerMultiplierStackProduct *= powerMultiplierCurrent;
          powerMultiplierCurrent = 1;
          next();
          skipWhitespace();
        }
        var uStr = void 0;
        if (c) {
          var oldC = c;
          uStr = parseUnit();
          if (uStr === null) {
            throw new SyntaxError('Unexpected "' + oldC + '" in "' + text + '" at index ' + index2.toString());
          }
        } else {
          break;
        }
        var res = _findUnit(uStr);
        if (res === null) {
          throw new SyntaxError('Unit "' + uStr + '" not found.');
        }
        var power = powerMultiplierCurrent * powerMultiplierStackProduct;
        skipWhitespace();
        if (parseCharacter("^")) {
          skipWhitespace();
          var p = parseNumber();
          if (p === null) {
            throw new SyntaxError('In "' + str + '", "^" must be followed by a floating-point number');
          }
          power *= p;
        }
        unit3.units.push({
          unit: res.unit,
          prefix: res.prefix,
          power
        });
        for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
          unit3.dimensions[i3] += (res.unit.dimensions[i3] || 0) * power;
        }
        skipWhitespace();
        while (c === ")") {
          if (powerMultiplierStack.length === 0) {
            throw new SyntaxError('Unmatched ")" in "' + text + '" at index ' + index2.toString());
          }
          powerMultiplierStackProduct /= powerMultiplierStack.pop();
          next();
          skipWhitespace();
        }
        expectingUnit = false;
        if (parseCharacter("*")) {
          powerMultiplierCurrent = 1;
          expectingUnit = true;
        } else if (parseCharacter("/")) {
          powerMultiplierCurrent = -1;
          expectingUnit = true;
        } else {
          powerMultiplierCurrent = 1;
        }
        if (res.unit.base) {
          var baseDim = res.unit.base.key;
          UNIT_SYSTEMS.auto[baseDim] = {
            unit: res.unit,
            prefix: res.prefix
          };
        }
      }
      skipWhitespace();
      if (c) {
        throw new SyntaxError('Could not parse: "' + str + '"');
      }
      if (expectingUnit) {
        throw new SyntaxError('Trailing characters: "' + str + '"');
      }
      if (powerMultiplierStack.length !== 0) {
        throw new SyntaxError('Unmatched "(" in "' + text + '"');
      }
      if (unit3.units.length === 0 && !options.allowNoUnits) {
        throw new SyntaxError('"' + str + '" contains no units');
      }
      unit3.value = value !== void 0 ? unit3._normalize(value) : null;
      return unit3;
    };
    Unit2.prototype.clone = function() {
      var unit3 = new Unit2();
      unit3.fixPrefix = this.fixPrefix;
      unit3.skipAutomaticSimplification = this.skipAutomaticSimplification;
      unit3.value = clone(this.value);
      unit3.dimensions = this.dimensions.slice(0);
      unit3.units = [];
      for (var i3 = 0; i3 < this.units.length; i3++) {
        unit3.units[i3] = {};
        for (var p in this.units[i3]) {
          if (hasOwnProperty(this.units[i3], p)) {
            unit3.units[i3][p] = this.units[i3][p];
          }
        }
      }
      return unit3;
    };
    Unit2.prototype.valueType = function() {
      return typeOf(this.value);
    };
    Unit2.prototype._isDerived = function() {
      if (this.units.length === 0) {
        return false;
      }
      return this.units.length > 1 || Math.abs(this.units[0].power - 1) > 1e-15;
    };
    Unit2.prototype._normalize = function(value) {
      if (value === null || value === void 0 || this.units.length === 0) {
        return value;
      }
      var res = value;
      var convert = Unit2._getNumberConverter(typeOf(value));
      for (var i3 = 0; i3 < this.units.length; i3++) {
        var unitValue = convert(this.units[i3].unit.value);
        var unitPrefixValue = convert(this.units[i3].prefix.value);
        var unitPower = convert(this.units[i3].power);
        res = multiplyScalar2(res, pow3(multiplyScalar2(unitValue, unitPrefixValue), unitPower));
      }
      return res;
    };
    Unit2.prototype._denormalize = function(value, prefixValue) {
      if (value === null || value === void 0 || this.units.length === 0) {
        return value;
      }
      var res = value;
      var convert = Unit2._getNumberConverter(typeOf(value));
      for (var i3 = 0; i3 < this.units.length; i3++) {
        var unitValue = convert(this.units[i3].unit.value);
        var unitPrefixValue = convert(this.units[i3].prefix.value);
        var unitPower = convert(this.units[i3].power);
        res = divideScalar2(res, pow3(multiplyScalar2(unitValue, unitPrefixValue), unitPower));
      }
      return res;
    };
    var _findUnit = memoize((str) => {
      if (hasOwnProperty(UNITS, str)) {
        var unit3 = UNITS[str];
        var prefix = unit3.prefixes[""];
        return {
          unit: unit3,
          prefix
        };
      }
      for (var _name in UNITS) {
        if (hasOwnProperty(UNITS, _name)) {
          if (endsWith(str, _name)) {
            var _unit = UNITS[_name];
            var prefixLen = str.length - _name.length;
            var prefixName = str.substring(0, prefixLen);
            var _prefix = hasOwnProperty(_unit.prefixes, prefixName) ? _unit.prefixes[prefixName] : void 0;
            if (_prefix !== void 0) {
              return {
                unit: _unit,
                prefix: _prefix
              };
            }
          }
        }
      }
      return null;
    }, {
      hasher: (args) => args[0],
      limit: 100
    });
    Unit2.isValuelessUnit = function(name310) {
      return _findUnit(name310) !== null;
    };
    Unit2.prototype.hasBase = function(base) {
      if (typeof base === "string") {
        base = BASE_UNITS[base];
      }
      if (!base) {
        return false;
      }
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        if (Math.abs((this.dimensions[i3] || 0) - (base.dimensions[i3] || 0)) > 1e-12) {
          return false;
        }
      }
      return true;
    };
    Unit2.prototype.equalBase = function(other) {
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        if (Math.abs((this.dimensions[i3] || 0) - (other.dimensions[i3] || 0)) > 1e-12) {
          return false;
        }
      }
      return true;
    };
    Unit2.prototype.equals = function(other) {
      return this.equalBase(other) && equal2(this.value, other.value);
    };
    Unit2.prototype.multiply = function(_other) {
      var res = this.clone();
      var other = isUnit(_other) ? _other : new Unit2(_other);
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        res.dimensions[i3] = (this.dimensions[i3] || 0) + (other.dimensions[i3] || 0);
      }
      for (var _i = 0; _i < other.units.length; _i++) {
        var inverted = _objectSpread2({}, other.units[_i]);
        res.units.push(inverted);
      }
      if (this.value !== null || other.value !== null) {
        var valThis = this.value === null ? this._normalize(1) : this.value;
        var valOther = other.value === null ? other._normalize(1) : other.value;
        res.value = multiplyScalar2(valThis, valOther);
      } else {
        res.value = null;
      }
      if (isUnit(_other)) {
        res.skipAutomaticSimplification = false;
      }
      return getNumericIfUnitless(res);
    };
    Unit2.prototype.divideInto = function(numerator) {
      return new Unit2(numerator).divide(this);
    };
    Unit2.prototype.divide = function(_other) {
      var res = this.clone();
      var other = isUnit(_other) ? _other : new Unit2(_other);
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        res.dimensions[i3] = (this.dimensions[i3] || 0) - (other.dimensions[i3] || 0);
      }
      for (var _i2 = 0; _i2 < other.units.length; _i2++) {
        var inverted = _objectSpread2(_objectSpread2({}, other.units[_i2]), {}, {
          power: -other.units[_i2].power
        });
        res.units.push(inverted);
      }
      if (this.value !== null || other.value !== null) {
        var valThis = this.value === null ? this._normalize(1) : this.value;
        var valOther = other.value === null ? other._normalize(1) : other.value;
        res.value = divideScalar2(valThis, valOther);
      } else {
        res.value = null;
      }
      if (isUnit(_other)) {
        res.skipAutomaticSimplification = false;
      }
      return getNumericIfUnitless(res);
    };
    Unit2.prototype.pow = function(p) {
      var res = this.clone();
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        res.dimensions[i3] = (this.dimensions[i3] || 0) * p;
      }
      for (var _i3 = 0; _i3 < res.units.length; _i3++) {
        res.units[_i3].power *= p;
      }
      if (res.value !== null) {
        res.value = pow3(res.value, p);
      } else {
        res.value = null;
      }
      res.skipAutomaticSimplification = false;
      return getNumericIfUnitless(res);
    };
    function getNumericIfUnitless(unit3) {
      if (unit3.equalBase(BASE_UNITS.NONE) && unit3.value !== null && !config4.predictable) {
        return unit3.value;
      } else {
        return unit3;
      }
    }
    Unit2.prototype.abs = function() {
      var ret = this.clone();
      if (ret.value !== null) {
        if (ret._isDerived() || ret.units[0].unit.offset === 0) {
          ret.value = abs3(ret.value);
        } else {
          var convert = ret._numberConverter();
          var unitValue = convert(ret.units[0].unit.value);
          var nominalOffset = convert(ret.units[0].unit.offset);
          var unitOffset = multiplyScalar2(unitValue, nominalOffset);
          ret.value = subtractScalar2(abs3(addScalar2(ret.value, unitOffset)), unitOffset);
        }
      }
      for (var i3 in ret.units) {
        if (ret.units[i3].unit.name === "VA" || ret.units[i3].unit.name === "VAR") {
          ret.units[i3].unit = UNITS.W;
        }
      }
      return ret;
    };
    Unit2.prototype.to = function(valuelessUnit) {
      var value = this.value === null ? this._normalize(1) : this.value;
      var other;
      if (typeof valuelessUnit === "string") {
        other = Unit2.parse(valuelessUnit);
      } else if (isUnit(valuelessUnit)) {
        other = valuelessUnit.clone();
      } else {
        throw new Error("String or Unit expected as parameter");
      }
      if (!this.equalBase(other)) {
        throw new Error("Units do not match ('".concat(other.toString(), "' != '").concat(this.toString(), "')"));
      }
      if (other.value !== null) {
        throw new Error("Cannot convert to a unit with a value");
      }
      if (this.value === null || this._isDerived() || this.units[0].unit.offset === other.units[0].unit.offset) {
        other.value = clone(value);
      } else {
        var convert = Unit2._getNumberConverter(typeOf(value));
        var thisUnitValue = this.units[0].unit.value;
        var thisNominalOffset = this.units[0].unit.offset;
        var thisUnitOffset = multiplyScalar2(thisUnitValue, thisNominalOffset);
        var otherUnitValue = other.units[0].unit.value;
        var otherNominalOffset = other.units[0].unit.offset;
        var otherUnitOffset = multiplyScalar2(otherUnitValue, otherNominalOffset);
        other.value = addScalar2(value, convert(subtractScalar2(thisUnitOffset, otherUnitOffset)));
      }
      other.fixPrefix = true;
      other.skipAutomaticSimplification = true;
      return other;
    };
    Unit2.prototype.toNumber = function(valuelessUnit) {
      return toNumber(this.toNumeric(valuelessUnit));
    };
    Unit2.prototype.toNumeric = function(valuelessUnit) {
      var other;
      if (valuelessUnit) {
        other = this.to(valuelessUnit);
      } else {
        other = this.clone();
      }
      if (other._isDerived() || other.units.length === 0) {
        return other._denormalize(other.value);
      } else {
        return other._denormalize(other.value, other.units[0].prefix.value);
      }
    };
    Unit2.prototype.toString = function() {
      return this.format();
    };
    Unit2.prototype.toJSON = function() {
      return {
        mathjs: "Unit",
        value: this._denormalize(this.value),
        unit: this.formatUnits(),
        fixPrefix: this.fixPrefix
      };
    };
    Unit2.fromJSON = function(json) {
      var unit3 = new Unit2(json.value, json.unit);
      unit3.fixPrefix = json.fixPrefix || false;
      return unit3;
    };
    Unit2.prototype.valueOf = Unit2.prototype.toString;
    Unit2.prototype.simplify = function() {
      var ret = this.clone();
      var proposedUnitList = [];
      var matchingBase;
      for (var key2 in currentUnitSystem) {
        if (hasOwnProperty(currentUnitSystem, key2)) {
          if (ret.hasBase(BASE_UNITS[key2])) {
            matchingBase = key2;
            break;
          }
        }
      }
      if (matchingBase === "NONE") {
        ret.units = [];
      } else {
        var matchingUnit;
        if (matchingBase) {
          if (hasOwnProperty(currentUnitSystem, matchingBase)) {
            matchingUnit = currentUnitSystem[matchingBase];
          }
        }
        if (matchingUnit) {
          ret.units = [{
            unit: matchingUnit.unit,
            prefix: matchingUnit.prefix,
            power: 1
          }];
        } else {
          var missingBaseDim = false;
          for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
            var baseDim = BASE_DIMENSIONS[i3];
            if (Math.abs(ret.dimensions[i3] || 0) > 1e-12) {
              if (hasOwnProperty(currentUnitSystem, baseDim)) {
                proposedUnitList.push({
                  unit: currentUnitSystem[baseDim].unit,
                  prefix: currentUnitSystem[baseDim].prefix,
                  power: ret.dimensions[i3] || 0
                });
              } else {
                missingBaseDim = true;
              }
            }
          }
          if (proposedUnitList.length < ret.units.length && !missingBaseDim) {
            ret.units = proposedUnitList;
          }
        }
      }
      return ret;
    };
    Unit2.prototype.toSI = function() {
      var ret = this.clone();
      var proposedUnitList = [];
      for (var i3 = 0; i3 < BASE_DIMENSIONS.length; i3++) {
        var baseDim = BASE_DIMENSIONS[i3];
        if (Math.abs(ret.dimensions[i3] || 0) > 1e-12) {
          if (hasOwnProperty(UNIT_SYSTEMS.si, baseDim)) {
            proposedUnitList.push({
              unit: UNIT_SYSTEMS.si[baseDim].unit,
              prefix: UNIT_SYSTEMS.si[baseDim].prefix,
              power: ret.dimensions[i3] || 0
            });
          } else {
            throw new Error("Cannot express custom unit " + baseDim + " in SI units");
          }
        }
      }
      ret.units = proposedUnitList;
      ret.fixPrefix = true;
      ret.skipAutomaticSimplification = true;
      return ret;
    };
    Unit2.prototype.formatUnits = function() {
      var strNum = "";
      var strDen = "";
      var nNum = 0;
      var nDen = 0;
      for (var i3 = 0; i3 < this.units.length; i3++) {
        if (this.units[i3].power > 0) {
          nNum++;
          strNum += " " + this.units[i3].prefix.name + this.units[i3].unit.name;
          if (Math.abs(this.units[i3].power - 1) > 1e-15) {
            strNum += "^" + this.units[i3].power;
          }
        } else if (this.units[i3].power < 0) {
          nDen++;
        }
      }
      if (nDen > 0) {
        for (var _i4 = 0; _i4 < this.units.length; _i4++) {
          if (this.units[_i4].power < 0) {
            if (nNum > 0) {
              strDen += " " + this.units[_i4].prefix.name + this.units[_i4].unit.name;
              if (Math.abs(this.units[_i4].power + 1) > 1e-15) {
                strDen += "^" + -this.units[_i4].power;
              }
            } else {
              strDen += " " + this.units[_i4].prefix.name + this.units[_i4].unit.name;
              strDen += "^" + this.units[_i4].power;
            }
          }
        }
      }
      strNum = strNum.substr(1);
      strDen = strDen.substr(1);
      if (nNum > 1 && nDen > 0) {
        strNum = "(" + strNum + ")";
      }
      if (nDen > 1 && nNum > 0) {
        strDen = "(" + strDen + ")";
      }
      var str = strNum;
      if (nNum > 0 && nDen > 0) {
        str += " / ";
      }
      str += strDen;
      return str;
    };
    Unit2.prototype.format = function(options) {
      var simp = this.skipAutomaticSimplification || this.value === null ? this.clone() : this.simplify();
      var isImaginary = false;
      if (typeof simp.value !== "undefined" && simp.value !== null && isComplex(simp.value)) {
        isImaginary = Math.abs(simp.value.re) < 1e-14;
      }
      for (var i3 in simp.units) {
        if (hasOwnProperty(simp.units, i3)) {
          if (simp.units[i3].unit) {
            if (simp.units[i3].unit.name === "VA" && isImaginary) {
              simp.units[i3].unit = UNITS.VAR;
            } else if (simp.units[i3].unit.name === "VAR" && !isImaginary) {
              simp.units[i3].unit = UNITS.VA;
            }
          }
        }
      }
      if (simp.units.length === 1 && !simp.fixPrefix) {
        if (Math.abs(simp.units[0].power - Math.round(simp.units[0].power)) < 1e-14) {
          simp.units[0].prefix = simp._bestPrefix();
        }
      }
      var value = simp._denormalize(simp.value);
      var str = simp.value !== null ? format5(value, options || {}) : "";
      var unitStr = simp.formatUnits();
      if (simp.value && isComplex(simp.value)) {
        str = "(" + str + ")";
      }
      if (unitStr.length > 0 && str.length > 0) {
        str += " ";
      }
      str += unitStr;
      return str;
    };
    Unit2.prototype._bestPrefix = function() {
      if (this.units.length !== 1) {
        throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
      }
      if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) >= 1e-14) {
        throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
      }
      var absValue = this.value !== null ? abs3(this.value) : 0;
      var absUnitValue = abs3(this.units[0].unit.value);
      var bestPrefix = this.units[0].prefix;
      if (absValue === 0) {
        return bestPrefix;
      }
      var power = this.units[0].power;
      var bestDiff = Math.log(absValue / Math.pow(bestPrefix.value * absUnitValue, power)) / Math.LN10 - 1.2;
      if (bestDiff > -2.200001 && bestDiff < 1.800001)
        return bestPrefix;
      bestDiff = Math.abs(bestDiff);
      var prefixes = this.units[0].unit.prefixes;
      for (var p in prefixes) {
        if (hasOwnProperty(prefixes, p)) {
          var prefix = prefixes[p];
          if (prefix.scientific) {
            var diff2 = Math.abs(Math.log(absValue / Math.pow(prefix.value * absUnitValue, power)) / Math.LN10 - 1.2);
            if (diff2 < bestDiff || diff2 === bestDiff && prefix.name.length < bestPrefix.name.length) {
              bestPrefix = prefix;
              bestDiff = diff2;
            }
          }
        }
      }
      return bestPrefix;
    };
    Unit2.prototype.splitUnit = function(parts) {
      var x = this.clone();
      var ret = [];
      for (var i3 = 0; i3 < parts.length; i3++) {
        x = x.to(parts[i3]);
        if (i3 === parts.length - 1)
          break;
        var xNumeric = x.toNumeric();
        var xRounded = round3(xNumeric);
        var xFixed = void 0;
        var isNearlyEqual = equal2(xRounded, xNumeric);
        if (isNearlyEqual) {
          xFixed = xRounded;
        } else {
          xFixed = fix2(x.toNumeric());
        }
        var y2 = new Unit2(xFixed, parts[i3].toString());
        ret.push(y2);
        x = subtractScalar2(x, y2);
      }
      var testSum = 0;
      for (var _i5 = 0; _i5 < ret.length; _i5++) {
        testSum = addScalar2(testSum, ret[_i5].value);
      }
      if (equal2(testSum, this.value)) {
        x.value = 0;
      }
      ret.push(x);
      return ret;
    };
    var PREFIXES = {
      NONE: {
        "": {
          name: "",
          value: 1,
          scientific: true
        }
      },
      SHORT: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        da: {
          name: "da",
          value: 10,
          scientific: false
        },
        h: {
          name: "h",
          value: 100,
          scientific: false
        },
        k: {
          name: "k",
          value: 1e3,
          scientific: true
        },
        M: {
          name: "M",
          value: 1e6,
          scientific: true
        },
        G: {
          name: "G",
          value: 1e9,
          scientific: true
        },
        T: {
          name: "T",
          value: 1e12,
          scientific: true
        },
        P: {
          name: "P",
          value: 1e15,
          scientific: true
        },
        E: {
          name: "E",
          value: 1e18,
          scientific: true
        },
        Z: {
          name: "Z",
          value: 1e21,
          scientific: true
        },
        Y: {
          name: "Y",
          value: 1e24,
          scientific: true
        },
        d: {
          name: "d",
          value: 0.1,
          scientific: false
        },
        c: {
          name: "c",
          value: 0.01,
          scientific: false
        },
        m: {
          name: "m",
          value: 1e-3,
          scientific: true
        },
        u: {
          name: "u",
          value: 1e-6,
          scientific: true
        },
        n: {
          name: "n",
          value: 1e-9,
          scientific: true
        },
        p: {
          name: "p",
          value: 1e-12,
          scientific: true
        },
        f: {
          name: "f",
          value: 1e-15,
          scientific: true
        },
        a: {
          name: "a",
          value: 1e-18,
          scientific: true
        },
        z: {
          name: "z",
          value: 1e-21,
          scientific: true
        },
        y: {
          name: "y",
          value: 1e-24,
          scientific: true
        }
      },
      LONG: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        deca: {
          name: "deca",
          value: 10,
          scientific: false
        },
        hecto: {
          name: "hecto",
          value: 100,
          scientific: false
        },
        kilo: {
          name: "kilo",
          value: 1e3,
          scientific: true
        },
        mega: {
          name: "mega",
          value: 1e6,
          scientific: true
        },
        giga: {
          name: "giga",
          value: 1e9,
          scientific: true
        },
        tera: {
          name: "tera",
          value: 1e12,
          scientific: true
        },
        peta: {
          name: "peta",
          value: 1e15,
          scientific: true
        },
        exa: {
          name: "exa",
          value: 1e18,
          scientific: true
        },
        zetta: {
          name: "zetta",
          value: 1e21,
          scientific: true
        },
        yotta: {
          name: "yotta",
          value: 1e24,
          scientific: true
        },
        deci: {
          name: "deci",
          value: 0.1,
          scientific: false
        },
        centi: {
          name: "centi",
          value: 0.01,
          scientific: false
        },
        milli: {
          name: "milli",
          value: 1e-3,
          scientific: true
        },
        micro: {
          name: "micro",
          value: 1e-6,
          scientific: true
        },
        nano: {
          name: "nano",
          value: 1e-9,
          scientific: true
        },
        pico: {
          name: "pico",
          value: 1e-12,
          scientific: true
        },
        femto: {
          name: "femto",
          value: 1e-15,
          scientific: true
        },
        atto: {
          name: "atto",
          value: 1e-18,
          scientific: true
        },
        zepto: {
          name: "zepto",
          value: 1e-21,
          scientific: true
        },
        yocto: {
          name: "yocto",
          value: 1e-24,
          scientific: true
        }
      },
      SQUARED: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        da: {
          name: "da",
          value: 100,
          scientific: false
        },
        h: {
          name: "h",
          value: 1e4,
          scientific: false
        },
        k: {
          name: "k",
          value: 1e6,
          scientific: true
        },
        M: {
          name: "M",
          value: 1e12,
          scientific: true
        },
        G: {
          name: "G",
          value: 1e18,
          scientific: true
        },
        T: {
          name: "T",
          value: 1e24,
          scientific: true
        },
        P: {
          name: "P",
          value: 1e30,
          scientific: true
        },
        E: {
          name: "E",
          value: 1e36,
          scientific: true
        },
        Z: {
          name: "Z",
          value: 1e42,
          scientific: true
        },
        Y: {
          name: "Y",
          value: 1e48,
          scientific: true
        },
        d: {
          name: "d",
          value: 0.01,
          scientific: false
        },
        c: {
          name: "c",
          value: 1e-4,
          scientific: false
        },
        m: {
          name: "m",
          value: 1e-6,
          scientific: true
        },
        u: {
          name: "u",
          value: 1e-12,
          scientific: true
        },
        n: {
          name: "n",
          value: 1e-18,
          scientific: true
        },
        p: {
          name: "p",
          value: 1e-24,
          scientific: true
        },
        f: {
          name: "f",
          value: 1e-30,
          scientific: true
        },
        a: {
          name: "a",
          value: 1e-36,
          scientific: true
        },
        z: {
          name: "z",
          value: 1e-42,
          scientific: true
        },
        y: {
          name: "y",
          value: 1e-48,
          scientific: true
        }
      },
      CUBIC: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        da: {
          name: "da",
          value: 1e3,
          scientific: false
        },
        h: {
          name: "h",
          value: 1e6,
          scientific: false
        },
        k: {
          name: "k",
          value: 1e9,
          scientific: true
        },
        M: {
          name: "M",
          value: 1e18,
          scientific: true
        },
        G: {
          name: "G",
          value: 1e27,
          scientific: true
        },
        T: {
          name: "T",
          value: 1e36,
          scientific: true
        },
        P: {
          name: "P",
          value: 1e45,
          scientific: true
        },
        E: {
          name: "E",
          value: 1e54,
          scientific: true
        },
        Z: {
          name: "Z",
          value: 1e63,
          scientific: true
        },
        Y: {
          name: "Y",
          value: 1e72,
          scientific: true
        },
        d: {
          name: "d",
          value: 1e-3,
          scientific: false
        },
        c: {
          name: "c",
          value: 1e-6,
          scientific: false
        },
        m: {
          name: "m",
          value: 1e-9,
          scientific: true
        },
        u: {
          name: "u",
          value: 1e-18,
          scientific: true
        },
        n: {
          name: "n",
          value: 1e-27,
          scientific: true
        },
        p: {
          name: "p",
          value: 1e-36,
          scientific: true
        },
        f: {
          name: "f",
          value: 1e-45,
          scientific: true
        },
        a: {
          name: "a",
          value: 1e-54,
          scientific: true
        },
        z: {
          name: "z",
          value: 1e-63,
          scientific: true
        },
        y: {
          name: "y",
          value: 1e-72,
          scientific: true
        }
      },
      BINARY_SHORT_SI: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        k: {
          name: "k",
          value: 1e3,
          scientific: true
        },
        M: {
          name: "M",
          value: 1e6,
          scientific: true
        },
        G: {
          name: "G",
          value: 1e9,
          scientific: true
        },
        T: {
          name: "T",
          value: 1e12,
          scientific: true
        },
        P: {
          name: "P",
          value: 1e15,
          scientific: true
        },
        E: {
          name: "E",
          value: 1e18,
          scientific: true
        },
        Z: {
          name: "Z",
          value: 1e21,
          scientific: true
        },
        Y: {
          name: "Y",
          value: 1e24,
          scientific: true
        }
      },
      BINARY_SHORT_IEC: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        Ki: {
          name: "Ki",
          value: 1024,
          scientific: true
        },
        Mi: {
          name: "Mi",
          value: Math.pow(1024, 2),
          scientific: true
        },
        Gi: {
          name: "Gi",
          value: Math.pow(1024, 3),
          scientific: true
        },
        Ti: {
          name: "Ti",
          value: Math.pow(1024, 4),
          scientific: true
        },
        Pi: {
          name: "Pi",
          value: Math.pow(1024, 5),
          scientific: true
        },
        Ei: {
          name: "Ei",
          value: Math.pow(1024, 6),
          scientific: true
        },
        Zi: {
          name: "Zi",
          value: Math.pow(1024, 7),
          scientific: true
        },
        Yi: {
          name: "Yi",
          value: Math.pow(1024, 8),
          scientific: true
        }
      },
      BINARY_LONG_SI: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        kilo: {
          name: "kilo",
          value: 1e3,
          scientific: true
        },
        mega: {
          name: "mega",
          value: 1e6,
          scientific: true
        },
        giga: {
          name: "giga",
          value: 1e9,
          scientific: true
        },
        tera: {
          name: "tera",
          value: 1e12,
          scientific: true
        },
        peta: {
          name: "peta",
          value: 1e15,
          scientific: true
        },
        exa: {
          name: "exa",
          value: 1e18,
          scientific: true
        },
        zetta: {
          name: "zetta",
          value: 1e21,
          scientific: true
        },
        yotta: {
          name: "yotta",
          value: 1e24,
          scientific: true
        }
      },
      BINARY_LONG_IEC: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        kibi: {
          name: "kibi",
          value: 1024,
          scientific: true
        },
        mebi: {
          name: "mebi",
          value: Math.pow(1024, 2),
          scientific: true
        },
        gibi: {
          name: "gibi",
          value: Math.pow(1024, 3),
          scientific: true
        },
        tebi: {
          name: "tebi",
          value: Math.pow(1024, 4),
          scientific: true
        },
        pebi: {
          name: "pebi",
          value: Math.pow(1024, 5),
          scientific: true
        },
        exi: {
          name: "exi",
          value: Math.pow(1024, 6),
          scientific: true
        },
        zebi: {
          name: "zebi",
          value: Math.pow(1024, 7),
          scientific: true
        },
        yobi: {
          name: "yobi",
          value: Math.pow(1024, 8),
          scientific: true
        }
      },
      BTU: {
        "": {
          name: "",
          value: 1,
          scientific: true
        },
        MM: {
          name: "MM",
          value: 1e6,
          scientific: true
        }
      }
    };
    PREFIXES.SHORTLONG = _extends({}, PREFIXES.SHORT, PREFIXES.LONG);
    PREFIXES.BINARY_SHORT = _extends({}, PREFIXES.BINARY_SHORT_SI, PREFIXES.BINARY_SHORT_IEC);
    PREFIXES.BINARY_LONG = _extends({}, PREFIXES.BINARY_LONG_SI, PREFIXES.BINARY_LONG_IEC);
    var BASE_DIMENSIONS = ["MASS", "LENGTH", "TIME", "CURRENT", "TEMPERATURE", "LUMINOUS_INTENSITY", "AMOUNT_OF_SUBSTANCE", "ANGLE", "BIT"];
    var BASE_UNITS = {
      NONE: {
        dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      MASS: {
        dimensions: [1, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      LENGTH: {
        dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
      },
      TIME: {
        dimensions: [0, 0, 1, 0, 0, 0, 0, 0, 0]
      },
      CURRENT: {
        dimensions: [0, 0, 0, 1, 0, 0, 0, 0, 0]
      },
      TEMPERATURE: {
        dimensions: [0, 0, 0, 0, 1, 0, 0, 0, 0]
      },
      LUMINOUS_INTENSITY: {
        dimensions: [0, 0, 0, 0, 0, 1, 0, 0, 0]
      },
      AMOUNT_OF_SUBSTANCE: {
        dimensions: [0, 0, 0, 0, 0, 0, 1, 0, 0]
      },
      FORCE: {
        dimensions: [1, 1, -2, 0, 0, 0, 0, 0, 0]
      },
      SURFACE: {
        dimensions: [0, 2, 0, 0, 0, 0, 0, 0, 0]
      },
      VOLUME: {
        dimensions: [0, 3, 0, 0, 0, 0, 0, 0, 0]
      },
      ENERGY: {
        dimensions: [1, 2, -2, 0, 0, 0, 0, 0, 0]
      },
      POWER: {
        dimensions: [1, 2, -3, 0, 0, 0, 0, 0, 0]
      },
      PRESSURE: {
        dimensions: [1, -1, -2, 0, 0, 0, 0, 0, 0]
      },
      ELECTRIC_CHARGE: {
        dimensions: [0, 0, 1, 1, 0, 0, 0, 0, 0]
      },
      ELECTRIC_CAPACITANCE: {
        dimensions: [-1, -2, 4, 2, 0, 0, 0, 0, 0]
      },
      ELECTRIC_POTENTIAL: {
        dimensions: [1, 2, -3, -1, 0, 0, 0, 0, 0]
      },
      ELECTRIC_RESISTANCE: {
        dimensions: [1, 2, -3, -2, 0, 0, 0, 0, 0]
      },
      ELECTRIC_INDUCTANCE: {
        dimensions: [1, 2, -2, -2, 0, 0, 0, 0, 0]
      },
      ELECTRIC_CONDUCTANCE: {
        dimensions: [-1, -2, 3, 2, 0, 0, 0, 0, 0]
      },
      MAGNETIC_FLUX: {
        dimensions: [1, 2, -2, -1, 0, 0, 0, 0, 0]
      },
      MAGNETIC_FLUX_DENSITY: {
        dimensions: [1, 0, -2, -1, 0, 0, 0, 0, 0]
      },
      FREQUENCY: {
        dimensions: [0, 0, -1, 0, 0, 0, 0, 0, 0]
      },
      ANGLE: {
        dimensions: [0, 0, 0, 0, 0, 0, 0, 1, 0]
      },
      BIT: {
        dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 1]
      }
    };
    for (var key in BASE_UNITS) {
      if (hasOwnProperty(BASE_UNITS, key)) {
        BASE_UNITS[key].key = key;
      }
    }
    var BASE_UNIT_NONE = {};
    var UNIT_NONE = {
      name: "",
      base: BASE_UNIT_NONE,
      value: 1,
      offset: 0,
      dimensions: BASE_DIMENSIONS.map((x) => 0)
    };
    var UNITS = {
      // length
      meter: {
        name: "meter",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.LONG,
        value: 1,
        offset: 0
      },
      inch: {
        name: "inch",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.0254,
        offset: 0
      },
      foot: {
        name: "foot",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.3048,
        offset: 0
      },
      yard: {
        name: "yard",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.9144,
        offset: 0
      },
      mile: {
        name: "mile",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 1609.344,
        offset: 0
      },
      link: {
        name: "link",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.201168,
        offset: 0
      },
      rod: {
        name: "rod",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 5.0292,
        offset: 0
      },
      chain: {
        name: "chain",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 20.1168,
        offset: 0
      },
      angstrom: {
        name: "angstrom",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 1e-10,
        offset: 0
      },
      m: {
        name: "m",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.SHORT,
        value: 1,
        offset: 0
      },
      in: {
        name: "in",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.0254,
        offset: 0
      },
      ft: {
        name: "ft",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.3048,
        offset: 0
      },
      yd: {
        name: "yd",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.9144,
        offset: 0
      },
      mi: {
        name: "mi",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 1609.344,
        offset: 0
      },
      li: {
        name: "li",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 0.201168,
        offset: 0
      },
      rd: {
        name: "rd",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 5.02921,
        offset: 0
      },
      ch: {
        name: "ch",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 20.1168,
        offset: 0
      },
      mil: {
        name: "mil",
        base: BASE_UNITS.LENGTH,
        prefixes: PREFIXES.NONE,
        value: 254e-7,
        offset: 0
      },
      // 1/1000 inch
      // Surface
      m2: {
        name: "m2",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.SQUARED,
        value: 1,
        offset: 0
      },
      sqin: {
        name: "sqin",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 64516e-8,
        offset: 0
      },
      // 645.16 mm2
      sqft: {
        name: "sqft",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 0.09290304,
        offset: 0
      },
      // 0.09290304 m2
      sqyd: {
        name: "sqyd",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 0.83612736,
        offset: 0
      },
      // 0.83612736 m2
      sqmi: {
        name: "sqmi",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 2589988110336e-6,
        offset: 0
      },
      // 2.589988110336 km2
      sqrd: {
        name: "sqrd",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 25.29295,
        offset: 0
      },
      // 25.29295 m2
      sqch: {
        name: "sqch",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 404.6873,
        offset: 0
      },
      // 404.6873 m2
      sqmil: {
        name: "sqmil",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 64516e-14,
        offset: 0
      },
      // 6.4516 * 10^-10 m2
      acre: {
        name: "acre",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 4046.86,
        offset: 0
      },
      // 4046.86 m2
      hectare: {
        name: "hectare",
        base: BASE_UNITS.SURFACE,
        prefixes: PREFIXES.NONE,
        value: 1e4,
        offset: 0
      },
      // 10000 m2
      // Volume
      m3: {
        name: "m3",
        base: BASE_UNITS.VOLUME,
        prefixes: PREFIXES.CUBIC,
        value: 1,
        offset: 0
      },
      L: {
        name: "L",
        base: BASE_UNITS.VOLUME,
        prefixes: PREFIXES.SHORT,
        value: 1e-3,
        offset: 0
      },
      // litre
      l: {
        name: "l",
        base: BASE_UNITS.VOLUME,
        prefixes: PREFIXES.SHORT,
        value: 1e-3,
        offset: 0
      },
      // litre
      litre: {
        name: "litre",
        value: 1e-3,
