$JSKK.Class.create
(
	{
		$namespace:	'strappy.ccl.component.spinner.controller',
		$name:		'State',
		$extends:	strappy.mvc.stateful.Controller
	}
)
(
	{},
	{
		init: function()
		{
			
			this.init.$parent();
			this.getView('Default').observe('onReady',this.onViewReady.bind(this));
			
			this.bindStateChanges
			(
				{
					currentValue:	'onCurrentValueChanged'
				}
			);
			
		},
		onBeforeChange: function(state, key, value)
		{
			
		},
		onViewReady: function(view)
		{
			
			this.setViewReadyState(view.$reflect('name'));
			if (this.getReadyViews().inArray(view.$reflect('name')))
			{
				this.setReady();
			}
			
		},
		onCurrentValueChanged: function(value)
		{
			
			this.getView('Default').setInputValue(strappy.ccl.helper.String.leftStrPad(value,  this.getConfig('defaultPadding'), '0'));
			
		},
		initialiseValue: function()
		{
			
			this.getStore('State').setCurrentValue(strappy.ccl.helper.String.leftStrPad(this.getConfig('defaultValue'), this.getConfig('defaultPadding'), '0'));
		
		},
		increase: function()
		{
			
			var stateStore = this.getStore('State'),
				currentValue = stateStore.getCurrentValue(),
				doLoop = this.getConfig('loop'),
				nextValue = null;
				
			if (this.getConfig('useNumeric'))
			{
				
				// increment if there is no max value or if there is a max value so long as the current value is less
				var maxValue = stateStore.get('maxValue'),
					minValue = stateStore.get('minValue');

				if (doLoop && (maxValue !== null || minValue !== null)) 
				{ // can't loop if we have no maxValue or minValue
					if (currentValue < maxValue) 
					{
						
						nextValue = currentValue + 1;
					} 
					else if (currentValue == maxValue) 
					{
						
						nextValue = minValue;
						
					}
				}
				else 
				{
					
					if (maxValue === null || currentValue < maxValue)
					{
						
						nextValue = currentValue + 1;
						
					}
					else
					{
						
						nextValue = currentValue
						
					}
				}

				stateStore.setCurrentValue( strappy.ccl.helper.String.leftStrPad(nextValue, this.getConfig('defaultPadding'), '0'));
				
			} else {
				var values = this.getConfig('altValues');
				var currentPosition = $.inArray(currentValue, values);
				
				
				if (currentPosition < (values.length - 1)) {
					currentPosition++;
					stateStore.setCurrentValue(values[currentPosition]);
				}
				else if (doLoop)
				{
					stateStore.setCurrentValue(values[0]);
				}
				
				
			}
		},
		decrease: function()
		{
			var stateStore = this.getStore('State'),
				currentValue = stateStore.get('currentValue'),
				doLoop = this.getConfig('loop'),
				previousValue = null;
			
			if (this.getConfig('useNumeric')) {
				var maxValue = stateStore.get('maxValue'),
					minValue = stateStore.get('minValue');
					
				if (doLoop && (maxValue !== null || minValue !== null)) { // can't loop if we have no maxValue or minValue
					if (currentValue > minValue) {
						previousValue = currentValue - 1;
					} else if (currentValue == minValue) {
						previousValue = maxValue;
					}
				} else {
					if (maxValue === null || currentValue > minValue) {
						previousValue = currentValue - 1;
					} else {
						previousValue = currentValue
					}
				}
				
				stateStore.setCurrentValue( strappy.ccl.helper.String.leftStrPad(previousValue, this.getConfig('defaultPadding'), '0'));
				
			} else {
				var values = this.getConfig('altValues');
				
				var currentPosition = $.inArray(currentValue, values);
				
				if (currentPosition > 0) {
					currentPosition--;
					stateStore.setCurrentValue(values[currentPosition]);
				}
				else if (doLoop)
				{
					stateStore.setCurrentValue(values[(values.length - 1)]);
				}
				
			}
		}
	}
);