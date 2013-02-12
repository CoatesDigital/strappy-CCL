$JSKK.Class.create
(
	{
		$namespace:	'strappy.ccl.component',
		$name:		'Spinner',
		$extends:	strappy.Component
	}
)
(
	{},
	{
		config:
		{
			attachTo:				null,
			
			name:					'',

			cls:			'spinner-container',

			/**
			 * @cfg {Integer} defaultValue Value to display on load
			 */
			defaultValue:			0,
			
			/**
			 * @cfg {Integer} defaultPadding how many digits to display e.g. if set to 2 1 will display as 01
			 */
			defaultPadding:			2,
			
			/**
			 * @cfg {Integer} minValue Minumum value for the spinner, null for none
			 */
			minValue:				null,
			
			/**
			 * @cfg {Integer} maxValue Maximum value for the spinner, null for none
			 */
			maxValue:				null,
			
			/**
			 * @cfg {Integer} precision Number of decimal places to display and increment and decrement
			 * @todo implement
			 */
			precision:				0,
			
			/**
			 * @cfg {Boolean} loop Whether to loop the spinner when it reaches the minumum or maxumum values.
			 * 
			 * Must have a minValue and maxValue values set for looping to work.
			 * 
			 * @todo implement for useNumeric == false
			 */
			loop:					false,
			
			/**
			 * @cfg {Boolean} useNumeric Whether to use straight up numbers (subject to precision config) e.g. -1, 0, 1, 2. If false the altValues config array should be set 
			 */
			useNumeric:				true,
			
			/**
			 * @cfg {String[]} altValues if useNumeric config is set to false this array must (well not must but nothing good will happen) be populated with the alternate values needed, e.g. 'AM', 'PM'
			 */
			altValues:				[],
			
			/**
			 * @cfg {Boolean} direxctEditable Whether the user can directly edit the value of the spinner, when false the controls MUSt be used
			 */
			directEditable:			true,
			
			/**
			 * @cfg {Boolean} doContinuous Whether to continuously change the value if the mouse is held down
			 */
			doContinuous:			true,
			
			/**
			 * @cfg {Integer} incrementTimeout When holding the mouse down the deleay between each value change
			 */
			incrementTimeout:		500,
			
			/**
			 * @cfg {Boolean} doAccelerate Whether to accelerate thevalue changes if the mouse is held down
			 */
			doAccelerate:			true,
			
			/**
			 * @cfg {Function} accelerationRatio simple ratio to control the acceleration, used if acceleration function not defined
			 */
			accelerationRatio:		0.9,
			
			/**
			 * @cfg {Integer} minimumTimeout Floor for the time out when using the accelerationRatio, ignored when using accelerationFunction
			 */
			minimumRatioTimeout:	100,
			
			/**
			 * @cfg {Function} acceleration Callback function, from parent component (or external library) to determine how fast the value changes accelerate
			 */
			accelerationFunction:	$JSKK.emptyFunction,
			
			
			signalKey:					null,
			
			signalSendDestination:		null,
			
			signalReceiveDestination:	null,
			
			
		},
		components:
		{
			
		},
		stores:
		[
			
		],
		views:
		[
			'Default'
		],
		controllers:
		[
			'Default'
		]
	}
);