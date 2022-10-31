import { BitSchema, BinaryTypes } from 'wsbitpacket';

export const schemas = new BitSchema(
    //server send schema
    [
        { name: 'id', data: { id: BinaryTypes.Uint16 } },
        { name: 'createPlayer', data: { id: BinaryTypes.Uint16, x: BinaryTypes.Uint16, y: BinaryTypes.Uint16, name: BinaryTypes.String } },
        { name: 'updatePlayer', data: { id: BinaryTypes.Uint16, x: BinaryTypes.Uint16, y: BinaryTypes.Uint16 } },
        { name: 'deletePlayer', data: { id: BinaryTypes.Uint16 } },
    ],
    // client send schema
    [{ name: 'direction', data: { dir: BinaryTypes.Uint8 } }]
);
