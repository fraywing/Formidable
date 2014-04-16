angular.module('formidable', [])
.directive('formBuilder', function($sce, $compile){
	var build = {
		scope : null,
		form : function(name){
			return "<div ng-form='"+name+"'></div>";
		},
		text : function(item, parent){
			return 	'<div class="form-group row">\
				<label class="col-sm-2 control-label" >'+item.label+'</label>\
				<div class="col-sm-4">\
					<input type="text" class="form-control"  ng-model="'+parent+"."+item.name+'"  ng-required="'+item.required+'">\
				</div>\
			</div>';
		},
		checkbox : function(item, parent){

			if(item.hide !== undefined)
			{
				var hide = "ng-click='"+item.hide+"= !"+item.hide+"'";
			}
			return 	'<div class="form-group row">\
				<label class="col-sm-2 control-label" >'+item.label+'</label>\
				<div class="col-sm-4">\
					<input type="checkbox" class=" checkbox" '+hide+'  ng-model="'+parent+"."+item.name+'"  ng-required="'+item.required+'">\
				</div>\
			</div>';
		},
		select : function(item, parent){

				if(this.scope.formBuilderSelectOpts[parent] === undefined) this.scope.formBuilderSelectOpts[parent] = {};
				this.scope.formBuilderSelectOpts[parent][item.name] = item.options;
			return 	'<div class="form-group row">\
			<label class="col-sm-2 control-label" >'+item.label+'</label>\
			<div class="col-sm-4">\
				<select ng-model="'+parent+"."+item.name+'" class="form-control" ng-options="obj.value as obj.title for obj in formBuilderSelectOpts[\''+parent+'\'].'+item.name+'" ng-required="'+item.required+'">\
					<option value="">'+item.placeholder+'</option>\
				</select>\
			</div>\
		</div>';
		},
		radio : function(item, parent){

			var options = "";
			angular.forEach(item.options, function(val){
				options+="<label class='radio-inline'>"+val.label+"<input type='radio' ng-model='"+parent+'.'+item.name+"' ng-required='"+item.required+"' value='"+val.value+"' ></span></label>&nbsp;";
			});
			return 	'<div class="form-group row">\
			<label class="col-sm-2 control-label" >'+item.label+'</label>\
			<div class="col-sm-4">'+options+'</div>\
			</div>';
		},
		divider : function(item, parent){
			return "<hr>";
		},
		header : function(item, parent){

			return "<h4 class='' >{{"+parent+"."+item.name+"Title}}</h4>";
		},
		textarea : function(item, parent){
			
			return 	'<div class="form-group row">\
				<label class="col-sm-2 control-label" >'+item.label+'</label>\
				<div class="col-sm-4">\
					<textarea  class="form-control" ng-model="'+parent+"."+item.name+'"  ng-required="'+item.required+'"></textarea>\
				</div>\
			</div>';
		},
		section : function(item, parent, noRow){
			if(noRow === undefined) noRow = false;
			if(item.title !== undefined)
			{
				var title = "<h3>{{"+parent+"."+item.name+"Title}}</h3>"
			}
			else
			{
				var title = "";
			}

			if(item.hide !== undefined)
			{
				var hideShow = "ng-hide='"+item.hide+"'";
			}
			else if(item.show !== undefined)
			{
				var hideShow = "ng-show='"+item.show+"'";
			}
			else
			{
				var hideShow = "";
			}
			return "<div "+hideShow+" ng-form='"+item.name+"Form' >"+title+"</div>";
		}
	},
	scope = null,
	form = "";

	return {
		replace : true,
		scope : "@",
		priority : 7777,
		link : function(scope, el, attr){
			build.scope = scope;
			scope.formBuilderSelectOpts = {};
			scope.$watch('formBuilderForm', function(val){
				if(val !== undefined)
				{
					//set the form's name and create a new scope for the form
					formName = val.formName;
					var formModel = val.formModel;
					scope[formModel] = {};

					form = build.form(formName);

					//iterate through each item
					angular.forEach(val.fields, function(formItem,formItemKey){
					formItem.name =  formItem.name.replace(" ", "");

					if(formItem.type == "section" || formItem.type == "header")
					{
					//create a scope for each item that is a section
					scope[formModel][formItem.name] = {};
					scope[formModel][formItem.name+"Title"] = formItem.name;
					}
					if(formItem.default !== undefined) scope[formModel][formItem.name] = formItem.default;
					if(formItem.required === undefined) formItem.required = false;
					//save the new element
					newItem = build[formItem.type](formItem, formModel);

					//recursion
					if(formItem.children !== undefined)
					{
						var parentName = formItem.name;

						angular.forEach(formItem.children, function(secondLevelItem,secondLevelKey){
							secondLevelItem.name = secondLevelItem.name.replace(" ", "");


							if(secondLevelItem.type == "section" || secondLevelItem.type == "header" )
							{
							scope[formModel][formItem.name][secondLevelItem.name] = {};
							scope[formModel][formItem.name][secondLevelItem.name+"Title"] = secondLevelItem.name;
							}
							if(secondLevelItem.default !== undefined) scope[formModel][formItem.name][secondLevelItem.name]  = secondLevelItem.default;
							if(secondLevelItem.required === undefined) secondLevelItem.required = false;

						secondItem = build[secondLevelItem.type](secondLevelItem, formModel+"."+formItem.name);
							//recursion
						if(secondLevelItem.children !== undefined)
						{
							angular.forEach(secondLevelItem.children, function(thirdLevelItem,thirdLevelKey){
								thirdLevelItem.name = thirdLevelItem.name.replace(" ", "");


								if(thirdLevelItem.type == "section" || thirdLevelItem.type == "header" )
								{
								thirdLevelItem.noRow = true;
								scope[formModel][formItem.name][secondLevelItem.name][thirdLevelItem.name] = {};
								scope[formModel][formItem.name][secondLevelItem.name][thirdLevelItem.name+"Title"] = thirdLevelItem.name;
								}
								if(thirdLevelItem.default !== undefined) scope[formModel][formItem.name][secondLevelItem.name][thirdLevelItem.name]   = thirdLevelItem.default;
								if(thirdLevelItem.required === undefined) thirdLevelItem.required = false;

								secondItem = $(secondItem).append(build[thirdLevelItem.type](thirdLevelItem, formModel+"."+formItem.name+"."+secondLevelItem.name));
							});
						}
							newItem = $(newItem).append(secondItem);
						});
						

					}
					
					//add it to the form element
					form = $(form).append(newItem); 

					});
					//compile it and add it to the 	element
					el.append($compile(form)(scope));
				}
			});
		}
	}

});
