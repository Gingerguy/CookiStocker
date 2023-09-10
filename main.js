// ===================================================================================
/*			
		Hello and welcome.
	This is the main file of the CookiStocker mod.
	If you came to reverse engineer the code or have more questions about the algorithm
	- you can just ask for advice in the Steam guide comments or on Discord: Gingerguy#2580.
		https://steamcommunity.com/sharedfiles/filedetails/?id=2599187047
*/

// 			Options

		// Announce transactions in game notifications
		const stockerTransactionNotifications = true

		// Make regular profit reports
		const stockerActivityReport = true
			// How often to make regular reports in ms (one half an hour by default)
			const stockerActivityReportFrequency = 1000 * 60 * 30

		// Make game notifications fade away on their own
		const stockerFastNotifications = false

		// Use console.log for more detailed info on trends
		const stockerConsoleAnnouncements = true

		// Logic loop frequency; do not touch it unless you are cheating
		const stockerLoopFrequency = 1000 * 30
		
		// The cheat itself. Rolls the cycle every time logic loop triggers
		const stockerForceLoopUpdates = false

		const hideBogdanoff = false
		const stockerGreeting = 'click clack you are now in debt'



// ===================================================================================

if (!stockList) {
	var stockList = {
		check: 'dump eet',
		goods: [],
		sessionStart: new Date(),
		startingProfits: 0,
		sessionProfits: 0,
		sessionPurchases: 0,
		sessionSales: 0,
		stocksRising: 0
	}
}

if (!hideBogdanoff) console.log('\n\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⢀⣀⣀⡀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠈⠛⢿⣷\n⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⣸⣿\n⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⢠⣾⣿⣿\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠈⢿⣿⣿⣿\n⠃⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠈⣿⣿⣿\n⠀⢀⠀⢠⠀⠀⠀⠀⠀⢿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡈⠻⠟⠛⠛⢿⣿⣿⡿⠇⠀⠀⠀⠀⠀⠀⣿⣿⣿\n⣶⣿⡀⠀⠀⠀⠀⠀⠀⠀⢻⣿⠋⠀⠀⣠⣤⣄⣀⣠⣀⡀⠀⠀⢀⣤⣴⣶⣿⣿⣿⣿⣿⡆⠀⠀⠀⢻⣿⡆⠀⠀⠀⠀⠀⠀⠀⠘⠋⠀\n⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠎⢀⣩⡽⣿⣿⣿⡏⠀⠀⠘⣿⣿⠟⠙⠿⠿⠟⠋⠀⠀⠀⠀⢀⣄⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⣿⣿⠉⠀⣠⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠈⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⢀⣤⠄⠀⠀⠀⠀⠀⠸⡷⠀\n⣿⣿⣷⡾⠟⠋⠁⠀⠀⠀⢼⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀\n⣿⠟⠁⠀⠀⠀⠀⠀⠀⢀⣴⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀\n⣿⠀⠀⠀⠀⠀⠀⣰⠀⢸⣿⠛⠉⠂⠀⠀⠀⠀⠀⠀⠀⠶⠤⣴⣶⠾⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠏⠀⠀⠐⡫⢀⣾⡇⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣶⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣀⣀⣠⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⣠⣴⠀⠹⡇⢿⣿⠃⠀⠀⠐⡀⠀⢠⣴⠶⠿⠿⠿⠿⠿⠟⢛⡿⠿⣿⣿⣿⣄⠀⡆⠀⠸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠠⢾⣿⣟⣠⢉⣥⣼⡏⠀⠀⠀⠀⠘⣶⠁⠀⠀⢤⣤⣠⣤⣤⣶⡿⠃⠀⠹⣿⣿⣷⣾⠁⠀⠀⠀⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠉⠛⠛⠛⠉⠀⠀⠀⢀⣿⣿⡟⠁⠀⠀⠀⠀⣰⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠐⢿⠟⠋⠙⠻⣿⣃⣀⣀⣤⣤⣶⣾⣿⠁⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠟⠉⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⡆⠸⣦⣤⣄⣀⣀⣠⣤⣤⣴⠎⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⣄⣀\n⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠹⣏⠛⠛⠛⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠀⠀⠀⢀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n\n     wot iz he doing in ze console?\n\n\n');

var modeDecoder = ['stable','slowly rising','slowly falling','rapidly rising','rapidly falling','fluctuating'] // meanings of each market trend (good.mode)
var goodIcons = [[2,33],[3,33],[4,33],[15,33],[16,33],[17,33],[5,33],[6,33],[7,33],[8,33],[13,33],[14,33],[19,33],[20,33],[32,33],[33,33],[35,33]];

function stockerTimeBeautifier(duration) {
	var milliseconds = Math.floor((duration % 1000) / 100),
	  //seconds = Math.floor((duration / 1000) % 60),
	  minutes = Math.floor((duration / (1000 * 60)) % 60),
	  hours = Math.floor((duration / (1000 * 60 * 60))); //% 24),
	  //days = Math.floor((duration / (1000 * 60 * 60 * 24)));

	if (hours > 0) {
		if (hours == 1) {
			hours = hours + ' hour'
		}
		else hours = hours + ' hours'
	}
	else hours = -1;

	if (minutes >= 1) {
		minutes = (minutes == 1) ? minutes + ' minute' : minutes + ' minutes';
	}
	else minutes = -1;
	
	if ((hours != -1) && (minutes != -1)) {	return hours + ' and ' + minutes;	}
	else if ((hours == -1) && (minutes != -1)) {	return minutes;	}
	else if ((hours != -1) && (minutes == -1)) {	return hours;	}
	else if ((hours == -1) && (minutes == -1)) {	return 'not that long actually';	}
}

setTimeout(function waitForGame() {
	if (typeof Game === 'object' && Game.ready) {
	

Game.registerMod("gincookistocker",{
	init:function(){

		this.startStocking();
	},
	startStocking:function(){
		if (!Game.ObjectsById[5].minigame) {
			console.log('=====$$$== Stock Market minigame has not initialised yet! Will try again in 500 ms.');
			setTimeout(() => {
				this.startStocking();
			},500);
			return
		}
		else {
			console.log('=====$$$== CookiStocker logic loop initialised at ' + new Date());
			console.log('=====$$$== With main options as follows:')
			console.log('=====$$$== Logic loop frequency: ' + stockerTimeBeautifier(stockerLoopFrequency))
			console.log('=====$$$== Report frequency: ' + stockerTimeBeautifier(stockerActivityReportFrequency))
			console.log('=====$$$== Cheating: ' + stockerForceLoopUpdates)
			Game.Notify(`CookiStocker is ready`,stockerGreeting,[1,33],false);
			console.log(stockList.check);
		}
		
		var market = Game.ObjectsById[5].minigame.goodsById;	// read market
		console.log('Reading the market:');
		stockList.startingProfits = Game.ObjectsById[5].minigame.profit;
		for (let i = 0; i < market.length; i++){
			var name=market[i].name.replace('%1',Game.bakeryName);
			stockList.goods.push({
		 		name: name,
		 		stock: market[i].stock,
		 		restingPrice: 10*(i+1) + Game.ObjectsById[i].level - 1,
		 		currentPrice: market[i].val,
				mode: market[i].mode,
				lastMode: market[i].mode,
		 		priceBought: -1,
			});
			console.log('Stock: ' + name + ' Status: ' + modeDecoder[market[i].mode]);
		}

		if (stockerActivityReport) {
			var stockerReportInterval = setInterval(function() {
				var stockerUptime = new Date() - stockList.sessionStart;
				if ((stockList.sessionPurchases + stockList.sessionSales) == 0) {
					Game.Notify(
						'CookiStocker report',
						'This session has been running for ' + stockerTimeBeautifier(stockerUptime) +
						', but no good investment opportunities were detected! Luck is not on our side, yet.'			
						,[26,7],stockerFastNotifications
					);
				} else {
					Game.Notify(
						'CookiStocker report',
						'This session has been running for ' + stockerTimeBeautifier(stockerUptime) +
						', and has made ' + stockList.sessionProfits.toFixed(0) +
						'$ in ' + stockList.sessionPurchases + ' purchases and ' + stockList.sessionSales + ' sales.'			
						,[26,7],stockerFastNotifications
					);
				}
			},stockerActivityReportFrequency);
		}

		var stockerLoop = setInterval(function() {

			if (stockerForceLoopUpdates) Game.ObjectsById[5].minigame.tick();	
				// setting stockerForceLoopUpdates to true will make the logic loop force the market to tick every time it triggers,
				// making this an obvious cheat, and i will personally resent you.
				
				// but
				// if you backup your save and set stockerLoopFrequency to like 10 milliseconds it looks very fun and effective.
				// yes, this is how i made the gif on the steam guide page.


			stockList.stocksRising = 0;

			market = Game.ObjectsById[5].minigame.goodsById;	// update market
			for (let i = 0; i < market.length; i++){
				//let i = 3;

				// update stockList
				stockList.goods[i].stock = market[i].stock;
				stockList.goods[i].currentPrice = market[i].val;
				stockList.goods[i].mode = market[i].mode;

				let md = stockList.goods[i].mode;
				let lmd = stockList.goods[i].lastMode;

				if (
					(md != lmd)	&& (Game.ObjectsById[i+2].amount > 0)	// new trend detected in a stock that is active
				)
				{
					if (stockerConsoleAnnouncements) {
						console.log(stockList.goods[i].name + ' has changed the mode from [' + modeDecoder[lmd] + '] to [' + modeDecoder[md] + ']');
					}
					
					if (lmd != 5 && md == 5) {	// ignore unstable stocks
						if (stockerTransactionNotifications) Game.Notify(stockList.goods[i].name + ' went unstable','Ignoring the stock for a time',[1,33],stockerFastNotifications);
					}

					if (	// buy conditions
						(
							(lmd == 2) && ((md !=4) && (md!=5)) ||	// slow fall stopped
							(lmd == 4) && ((md !=2) && (md!=5))	||	// fast fall stopped
							(lmd == 5) && ((md !=2) && (md!=4))		// chaotic stopped
						)
						&&
						(stockList.goods[i].currentPrice < stockList.goods[i].restingPrice)	// only if the price is lower than resting price
					)
					{
						// buying
						stockList.goods[i].priceBought = stockList.goods[i].currentPrice;
						Game.ObjectsById[5].minigame.buyGood(i,10000);
						stockList.sessionPurchases++;
						if (stockerTransactionNotifications) Game.Notify('Buying ' + stockList.goods[i].name,'The price has stopped ' + modeDecoder[stockList.goods[i].lastMode] + ' at ' + Math.floor(stockList.goods[i].priceBought) + '$ per unit, and is ' + modeDecoder[stockList.goods[i].mode] + ' now.',goodIcons[i],stockerFastNotifications);
						if (stockerConsoleAnnouncements) console.log('=====$$$== Buying '+ stockList.goods[i].name);
					}

					if (	// sell conditions
						(stockList.goods[i].stock > 0)	// only if the stock is present
						&&
						(
							(lmd == 1) && ((md !=3) && (md!=5))	||	// slow rise stopped
							(lmd == 3) && ((md !=1) && (md!=5))	||	// fast rise stopped
							(lmd == 5) && ((md !=1) && (md!=3))		// chaotic stopped
						)
						&& (stockList.goods[i].currentPrice > stockList.goods[i].priceBought)	// only if the price is higher than the price it was bought at
					)
					{
						// selling
						stockList.goods[i].priceBought = -1;
						Game.ObjectsById[5].minigame.sellGood(i,10000);
						stockList.sessionSales++;
						if (stockerTransactionNotifications) Game.Notify('Selling ' + stockList.goods[i].name,'At a profit of ' + Math.floor(stockList.goods[i].currentPrice - stockList.goods[i].priceBought) + '$ per unit (total ' + Math.floor(stockList.goods[i].currentPrice - stockList.goods[i].priceBought)*stockList.goods[i].stock + '$ profit), and is ' + modeDecoder[stockList.goods[i].mode] + ' now.',goodIcons[i],stockerFastNotifications);
						if (stockerConsoleAnnouncements) ('=====$$$== Selling '+ stockList.goods[i].name +' at a profit of ' + (stockList.goods[i].currentPrice - stockList.goods[i].priceBought).toFixed(2));

					}
					
					stockList.sessionProfits = Game.ObjectsById[5].minigame.profit - stockList.startingProfits;
					stockList.goods[i].lastMode = stockList.goods[i].mode	// update last mode
				}
			}
		},stockerLoopFrequency);
	},
});

}
else setTimeout(waitForGame,100)
})
