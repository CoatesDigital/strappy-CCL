$JSKK.Class.create
(
	{
		$namespace:	'strappy.ccl.component.spinner.controller',
		$name:		'Default',
		$extends:	strappy.mvc.Controller
	}
)
(
	{},
	{
		
		mouseDown:				false,
		controlFocus:			false,
		timingOut:				false,
		timer:					null,
		currentTimeoutLength:	500,
		
		init: function()
		{
			
			this.init.$parent();
			this.getView('Default')	.observe('onTemplatesLoaded',	this.onTemplatesLoaded.bind(this));
			this.getController('State')	.observe('onReadyState',		this.onReadyState.bind(this));
			
			this.setRangeState();
			
			// receiving initialisation and values from the parent component
			this.registerSignals
			(
				{
					onValueChange:
					{
						signal:	strappy.CCL.Signal.SPINNER_CHANGE,
						type:	strappy.CCL.Type.CHANGE,
						filter:
						{
							key:					this.getConfig('signalKey'),
							destination:			this.getConfig('signalReceiveDestination')
						}
					}
				}
			);
			
		},
		onTemplatesLoaded: function(view)
		{
			
			view.renderTemplate();

		},
		onReadyState: function()
		{
			
			this.getController('State').initialiseValue();
			
		},
		onValueChange: function(signal)
		{
			
			var signalBody = signal.getBody();
			this.getStore('State').setCurrentValue(signalBody.value);
			
		},
		onControlMousedown: function(ev)
		{
			
			this.mouseDown = true;
            var target = $(ev.target); //Bug fix: was $(ev.currentTarget) which returns the parent element
//			this.getView('Default').setControlActive(target);
			
			// if we wish to allow for continuous value change , make sure we run through the method that sets up the timeout
			if (this.getConfig('doContinuous')) {
				
				if (this.controlFocus) {
					if (this.timingOut) {
						clearTimeout(this.timer);
						this.timingOut = false;
						this.resetTimeout();
					}
					return this.rotateSpinner(target);

				}
			}
			
			// otherwise just run a rotation
			return this.rotate(target);
			
		},
        onControlClick:function(ev)
        {

            this.mouseDown = false;
			
            var target = $(ev.target);
			
            return this.rotate(target);
			
        },
		onControlMouseup: function(ev)
		{
			
			this.mouseDown = false;
			var target = $(ev.target);
//			this.getView('Default').removeControlActive(target);

		},
		onControlMouseover: function()
		{
			
			this.controlFocus = true;
			
		},
		onControlMouseout: function()
		{
			
			this.controlFocus = false;
			
		},
		onInputFocus: function(ev)
		{

			if (!this.getConfig('directEditable'))
			{

				// at present you should only reach here when this.getConfig('directEditable') is false;
				ev.preventDefault();
				$(ev.currentTarget).blur(); // shouldn't need this

				// @todo establish a method to focus the next input (or other dom element)
				return;

			}
			
		},
        onInputFocusout: function()
        {
			
            var newValue = this.getView('Default').getInputValue();
            var store = this.getStore('State');

			// validation for the current spinner value
            if (this.getConfig('useNumeric'))
            {
            	
                if( !isNaN(parseFloat(newValue)))
                {
                	
                    if(parseFloat(newValue) >= this.getConfig('minValue') && parseFloat(newValue) <= this.getConfig('maxValue'))
                    {
                    	
                        //set new value
                        this.setUserInputValue(strappy.ccl.helper.String.leftStrPad(newValue, this.getConfig('defaultPadding'), '0'));
                        
                    }
                    else if(parseFloat(newValue) < this.getConfig('minValue'))
                    {
                    	
                        //user input is less than min value. therefore setting min value
                        this.setUserInputValue(strappy.ccl.helper.String.leftStrPad(this.getConfig('minValue'), this.getConfig('defaultPadding'), '0'));
                        
                    }
                    else
                    {
                    	
                        //user input is greater than min value. therefore setting min value
                        this.setUserInputValue(strappy.ccl.helper.String.leftStrPad(this.getConfig('maxValue'), this.getConfig('defaultPadding'), '0'));
                        
                    }
                    
                } 
                else
                {
                	
                    //setting current value
                    this.getView('Default').setInputValue(store.get('currentValue'));
                    
                }
            }
            else
            {
            	
                if (this.getConfig('altValues').inArray(newValue))
                {
                	
                    //set new value
                    this.setUserInputValue(newValue);
                    
                }
                else
                {
                	
                    //incorrect input
                    this.getView('Default').setInputValue(store.get('currentValue'));
                    
                }
            }
            
        },
        setUserInputValue: function(val)
        {
        	
            this.getView('Default').setInputValue(val);
            this.getStore('State').setCurrentValue(val);
            this.sendValue();
            
		},
		setRangeState: function()
		{	
			
			var stateStore = this.getStore('State');
			
			var minValue = this.getConfig('minValue');
			if (!Object.isNull(minValue))
			{
				stateStore.set('minValue', minValue);
			}
			
			var maxValue = this.getConfig('maxValue');
			if (!Object.isNull(maxValue))
			{
				stateStore.set('maxValue', maxValue);
			}
			
		},
		
		rotateSpinner: function(target)
		{
			
			var direction = target.attr('class');
			
			// set a timeout and rotate if the mouse is down, otherwise clear the time out
			this.timer = setTimeout(function() 
			{
				if (this.mouseDown) {
					this.rotate(direction);
					
					this.currentTimeoutLength = this.getTimeout();
					target.mousedown();
				} else {
					clearTimeout(this.timer);
					this.timingOut = false;
					this.resetTimeout();
				}
			}.bind(this), this.currentTimeoutLength);
			
		},
		
		rotate: function(target)
		{
			var direction = null;
			// check if we already have the direction or if we need to get it again
			// @todo store the direction in a class property to avoid doing this jiggery pokery and allowing mixed variable type
			if (target.jquery) 
			{
				
				direction = target.attr('class');
				
			}
			
			if (direction === null)
			{
				throw Error('Spinner direction could not be set');	
			}
			
			// letthe state controller know that we need to do an increment
			switch (direction)
			{
				case 'up':
					this.getController('State').increase();
					break
				case 'down':
					this.getController('State').decrease();
					break
				default:
					break
			}
			
			this.sendValue();
			
		},	
		
		getTimeout: function()
		{
			
			if (this.getConfig('doAccelerate')) {
				// if accelerating and using a function
				if (this.getConfig('accelerationFunction'))
				{
					
					// @todo pass paramters time (duration of the change), initial time, final time.
					var time = 3000;
					return this.getConfig('accelerationFunction')(time, this.getConfig('minimumRatioTimeout'), this.getConfig('incrementTimeout'));
					
				}
				// if accelerating and using a simple ratio
				if (this.currentTimeoutLength > this.getConfig('minimumRatioTimeout'))
				{
					
					return this.currentTimeoutLength * this.getConfig('accelerationRatio');
					
				}
			}
			
			// otherwise just a constant rate of change
			return this.currentTimeoutLength;
			
		},
		
		resetTimeout: function()
		{
			
			this.currentTimeoutLength = this.getConfig('incrementTimeout');
			
		},
		
		sendValue: function()
		{

			// sending valule to the parent component
			var currentValue = this.getStore('State').get('currentValue');
			this.sendSignal
			(
				strappy.CCL.Signal.SPINNER_CHANGE,
				strappy.CCL.Type.CHANGE,
				{
					key:			this.getConfig('signalKey'),
					destination:	this.getConfig('signalSendDestination')
				},
				{
					value:	currentValue,
					source: this.getConfig('name')
				}
			);
				
		},
		
		onSignalShow: function()
		{
			
			this.getView('Default').show();
			
		},
		
		onSignalHide: function()
		{
			
			this.getView('Default').hide();
			
		}
		
	}
	
);