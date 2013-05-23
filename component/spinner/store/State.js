$JSKK.Class.create
(
	{
		$namespace:	'strappy.ccl.component.spinner.store',
		$name:		'State',
		$extends:	strappy.data.stateful.Store
	}
)
(
	{},
	{
		data:
		{
			'public':
			{
				
			},
			'private':
			{
				currentValue:		null,
				minValue:  			null,
				maxValue:  			null
			}
		},
		getCurrentValue: function()
		{
			if (this.getConfig('useNumeric')) {
				return this.get('currentValue') * 1;
			}
			return this.get('currentValue');
			
		},
		setCurrentValue: function(value)
		{
			return this.set('currentValue', value);
		}
	}
);