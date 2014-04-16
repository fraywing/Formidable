Formidible
==========

A a really slick form builder for Angular and Bootstrap. JSON in one end, a nice form out the other. 



###In your controller:
```javascript
$scope.formBuilderForm = {
		formName : "testForm",
		formModel : "testData",
		fields : [
		{
			type : "section",
			name : "coolItems",
			title : "A cool Section",
			children : [
				{
					type: "text",
					name : "textItem",
					required : true,
					default : "some stuff",
					label : "SSASD",
					placeholder : "acool thing"
				},
				{
					type: "checkbox",
					default : "false",
					hide : "hidetest",
					name : "athing",
					label : "ddasdas dsd",
					placeholder : "acool thing",
				}
			]
		},
		{
			type : "divider",
			name : "a dviders"
		},
		{
			type : "section",
			show : "hidetest",
			name : "coolOtherThings",
			title : "Another sectiopn",
			children : [
				{
					type: "text",
					name : "textItem",
					label : "dgdfgwergr",
					placeholder : "acool thing"
				},
				{
					type : "section",
					name : "aSubSection",
					hidden : "hidetest",
					children : [
						{
							type: "radio",
							name : "radio1",
							default : "radio1",
							label : "SAdasda",
							options : [
									{
										value : "radio1",
										label : "some other thing"
									},
									{
										value : "radio2",
										label : "some thing"
									}
								]
						},
						{
							type: "radio",
							name : "radio4",
							label : "dssdada ",
							options : [
									{
										value : "radio1",
										label : "a thign"
									},
									{
										value : "radio2",
										label : "another thing"
									}
								]
						}
						]
				}
			]
		},
		{
			type : "section",
			show : "hidetest",
			name : "andSomeotherstuff",
			title : "Select Section",
			children : [
				{
					type: "select",
					label : "afwegweegw",
					name : "selettest",
					required : "hidetest",
					default : "anotherthing",
					placeholder : "Select a test",
					options : [
						{title : "a thing", value : "anotherthing"},
						{title : "a thing2", value : "another thing2"},
						{title : "a thing3", value : "another thing3"}
					]
				},
				{
					type : "header",
					name : "dumb header",
					value : "HYY THERE"
				},
				{
					type: "text",
					name : "text5",
					value : "text7",
					required :"hidetest",
					label : "efwefef",
					placeholder : "a thing2222"
				},
				{
					type: "textarea",
					name : "anothe box",
					label : "gewgfweg",
					value : "textbox1",
					required : "hidetest",
					placeholder : "textarea"
				}
			]
		}
	]
};
```
###In your partial:

```html
<div form-builder form-builder-form="formBuilderForm"></div>
````
Voila!
