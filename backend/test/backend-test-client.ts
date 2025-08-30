import moment from 'moment-timezone';


const baseUrl = 'http://localhost:8281';

const controllerCategories = "economic-categories"
const controllerAccounts = "economic-accounts"
const controllerMovements = "movements"
const controllerPatrimonials = "patrimonial-funds"

const controller = controllerMovements;

// let response = await testGetAll();
// console.log( response.list[response.list.length-1] )

// await testDelete(10);
    const currentDate = new Date();


    // console.log(currentDate.toISOString());
    let testMovement = {
        dt:currentDate.toISOString(),
        economicAccount:{id:1},
        note:"Test movement",
        patrimonialFund:{id:1},
        amount:100.00,
        blockId:new Date().getTime()
    }
    // let response = await testInsert(testMovement);
    console.log( testMovement )

// await testGetAll();
// await testGetId(14);

// await testSearch({ dto:{code:"E"}, page:1, size:9999 });

// await testInsert({ id:14, code:"", label:"", nature:"" });
// await testInsert({ code:"", label:"", nature:"" });
// await testInsert({ code:"AUTO", label:"Auto", nature:"C" });
// await testInsert({ code:"AUTOS1", label:"Auto1", nature:"R" });

// await testEdit({ id:16, code:"AUTOS2", label:"Auto2", nature:"C" });

// await testDelete(16);


async function testGetId(id:number) : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/id/${id}`);
    return await readResponse(response);
}

async function testGetAll() : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/all`);
    return await readResponse(response);
}

async function testSearch(searchBody : any) : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    });
    return await readResponse(response);
}

async function testInsert(insertBody : any) : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(insertBody)
    });

    return await readResponse(response);

}


async function testEdit(editBody : any) : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editBody)
    });

    return await readResponse(response);
}

async function testDelete(id : number) : Promise<void> {
    const response = await fetch(`${baseUrl}/${controller}/id/${id}`, {
        method: 'DELETE'
    });

    return await readResponse(response);
}


async function readResponse(response : Response): Promise<any> {
    if (!response.ok) {
        console.error(response);
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}
