const endpoint = "https://pokeapi.co/api/v2/";

async function getData(endpointString, fullstring = false){

    try{
        const data = await makeRequest(endpointString, fullstring);
        const retData = JSON.parse(data);
        return retData;
    }
    catch (error){
        console.log(error);
        throw new Error("Failed to fetch data for endpoint " + endpoint + "" + endpointString);
    }
}

function makeRequest(endpointString, fullstring) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        let url;
        
        switch(fullstring){
            case true:
                url = endpointString;
            break;

            case false:
                url = endpoint + endpointString;
            break;
        }
        

        xhr.open("GET", url);

        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300){
                resolve(xhr.response);
            }
            else{
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        }
        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        }

        xhr.send();
    });
}

export { getData };