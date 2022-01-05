const cronAction = () => {
  ScriptApp.newTrigger('coinPrice')
      .timeBased()
      .everyHours(1)
      .create();
}
  
const coinPrice = async() =>{
  //********** Only Edit This ********** 
    const infos = {
      SheetLink:'THE_LINK_TO_YOUR_GOOGLE_SPREADSHEET_HERE',
      SheetTabName: 'TAB_NAME_HERE',
      LimitCoins: '100', //Enter a limit between 1-5000
      ApiKey: 'YOUR_COINMARKETCAP_API_KEY_HERE'
    }
  //********** Only Edit This ********** 
  
    const myGoogleSheet =
      SpreadsheetApp.openByUrl(infos.SheetLink).getSheetByName(infos.SheetTabName)

    const cmcMap = await getDataApi('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', infos.LimitCoins, infos.ApiKey)
    const cmcMapData = cmcMap.data;

    myGoogleSheet.clearContents();
    myGoogleSheet.appendRow(["Rank", "Name(Symbol)", "Price", "24h %", "7h %"]);
    for(let i=0; i < 100; i++){
      const price = cmcMapData[i].quote.USD.price,
            percent24 = cmcMapData[i].quote.USD.percent_change_24h,
            percent7 = cmcMapData[i].quote.USD.percent_change_7d,
            namesymbol = `${cmcMapData[i].name} (${cmcMapData[i].symbol})`;  

      myGoogleSheet.appendRow([i+1, namesymbol, price, percent24, percent7 ]);
    }
}

const getDataApi = async (api, limite, cmckey) => {
  let apiGet = await UrlFetchApp.fetch(`${api}`, {
    method: 'GET',
    qs: {
      start: '1',
      limit: limite
    },
    headers: {
      "X-CMC_PRO_API_KEY": cmckey
    },
    json: true,
    gzip: true,
  })
  let data = await JSON.parse(apiGet);
  return data;
}
