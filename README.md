# extrarice
This project covers the topic for Interpolation, Extrapolation and Polynomial Approximation

The following are the user guides, as well as the restrictions, requirements and assumptions
denoted by (*) for the different scenarios in using the application. The project is still on its first
phase of the development, hence, the functionality will be limited and more features are yet to be included
on the next update.

Input: 	Income      -> 	Description	// Inflow
			Amount
	Expenses    ->	Description	// Outflow
			Amount
	Periodicity ->	Daily, Weekly, Monthly, Quarterly, Yearly // Selection for time period of cashflow

*User can't change periodicity after an initial cashflow is registered on a the selected time period.

*The time period (x) will be generated automatically by the system upon registering a cashflow.

*User should provide sufficient data from the upper part of the screen in order to utilize
the chart and approximation of data.

*For polynomial approximation of value, atleast 4 cashflows must be registered in order
to input atleast 4 data points or beyond.

*Inputs will not register repeated data points and repeated estimated values.

*The use of whole numbers and decimal numbers are allowed for inputs.

Input: 	Data Points  ->	Known values along the x-axis (time period data points)
	Estimate Value -> Value to be approximated with interpolation or extrapolation

-------------------------------------------------------------------------------------------------------

Output:	Income/Expense Register -> 	// Shows the financial activity of the user,
					it also calculates the net cashflow on every
					input of inflow and outflow.
	Cashflow Table 		-> 	// After the register of cashflow, it will be
					transfered to cashflow table with the calculated
					income total and expense total and net cashflow
					for the time period.
	Curve Chart		->	// Net cashflow on a certain time period will be
					plotted on the chart for visualization of the
					table. (Time Period(x), Net cashflow(y))
	Data Points Register	->	// This will store the data point coordinates (x,y)
					that have been used for the calculation.
	Estimates Register	->	// This will store the estimated value coordinates (x,y)
					after being calculated.
	
*The 1st phase of the application does not include a function that will store all the data for the
registered values on a local/cloud storage, hence, upon refreshing the window, all the data points that
are stored will be cleared.

<------------------------ Enjoy! ------------------------------------------------------------------->
