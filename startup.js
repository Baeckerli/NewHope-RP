import * as alt from 'alt-server';
import chat from 'chat';

alt.log('Hello from server');
alt.on('playerConnect', (player) => {

});

function handleConnect(player){
    
    player.spawn(-1291.71, 83.43, 54.89, 1000);
    player.model = `mp_m_freeemode_01`
}

alt.on('playerDeath', handleDeath);

export const DeadPlayers = {};
const TimeBetweenRespawn = 5000; 

function handleDeath(player) {
    if (deadPlayers[player.id]) {
        return;
    }

    deadPlayers[player.id] = alt.setTimeout(() => {
        if (deadPlayers[player.id]) {
            delete deadPlayers[player.id];
        }

        if (!player || !player.valid) {
            return;
        }

        player.spawn(0, 0, 0, 0); 
    }, TimeBetweenRespawn);
}
export function cancelRespawn(player) {
    if (!deadPlayers[player.id]) {
        return;
    }

    alt.clearTimeout(deadPlayers[player.id]);
    delete deadPlayers[player.id];
}

export function createVehicle(player, vehicleModel) {
    let vehicle;

    try {
        vehicle = new alt.Vehicle(vehicleModel, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch (err) {
        console.error(`${vehicleModel} does not exist.`);
        throw err;
    }

    if (!vehicle) {
        console.error(`${vehicleModel} does not exist.`);
        return;
    }

    console.log('Spawned a vehicle');
    return vehicle;
}
chat.registerCmd('spawn', (player, modelName) => {
    if (!modelName) {
        modelName = 'mp_m_freemode_01';
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);

    try {
        player.model = modelName;
    } catch (err) {
        player.send(player, 'Invalid Model. Using default.');
        player.model = 'mp_m_freemode_01';
    }
});
chat.registerCmd('vehicle', (player, modelName) => {
    if (!modelName) {
        chat.send(player, `/vehicle [modelName]`);
        return;
    }

    let vehicle;

    try {
        vehicle = new alt.Vehicle(modelName, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch (err) {
        chat.send(player, `~r~Invalid vehicle model.`);
        return;
    }
});
chat.registerCmd('pos', (player) => {
    chat.send(player, `${JSON.stringify(player.pos)}`);
    console.log(player.pos);
});
