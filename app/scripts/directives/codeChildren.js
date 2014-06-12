'use strict';

angular.module('icd10App')
  .directive('codeChildren', function ($timeout) {

  	var isCodeAChild = function(possibleParent, possibleChild){
  		return (possibleChild.indexOf(possibleParent)===0)
  	}
  	var treeDigger = function (treeObject, codeToAdd){
		  			if(treeObject.length>0 && isCodeAChild(_.last(treeObject).code, codeToAdd)){
			  			return treeDigger(_.last(treeObject).children, codeToAdd)
		  			} else {
		  				return treeObject;
		  			}
			return treeObject;
  	}
    return {
      templateUrl: 'views/code_children.html',
	    restrict: 'EA',
	    controller:function($scope, $element, $attrs, $transclude) {
	    	// need to prime the data before the linking phase
	    	// otherwise the tree directive see no data
	    	$scope.familyTree = [{}];
	    	$scope.my_tree = {};
	    },
      link: function postLink(scope, element, attrs) {
      	var childrenCodes = scope.code.m;
      	var fullFamilyTree = [{
      		code: scope.code.c,
      		label: scope.code.c + scope.code.d[0],
      		children: []
      	}];
      	// console.log(scope.dx_children, scope.isChildrenDataLoaded)
      	_.each(childrenCodes, function(code, index){
      		var properLevel = treeDigger(fullFamilyTree, code);
      		// console.log(scope.dx_children[code])
      		properLevel.push({code: code, i: scope.dx_children[code].i, label:code + ': '+scope.dx_children[code].d, data: {description:""},children:[]});
      	});
      	scope.familyTree = fullFamilyTree[0].children;
      	// console.log(scope.query)
      	$timeout(function(){
      		scope.my_tree.expand_all();
      	})

      }
    };
  });
