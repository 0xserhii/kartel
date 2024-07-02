// Require Dependencies
import { BLOCKCHAIN_HTTPPROVIDER_API } from '@/config';
import { JsonRpc } from 'eosjs';
import got from 'got';
import fetch from 'node-fetch'; // node only; not needed in browsers


const rpc = new JsonRpc(BLOCKCHAIN_HTTPPROVIDER_API, { fetch });
const gpc = got.post;

// Grab EOS block with id
const getPublicSeed = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await rpc.get_info();
            const blockNumber = info.last_irreversible_block_num + 1;
            const block = await rpc.get_block(blockNumber || 1);
            resolve(block.id);
        } catch (error) {
            reject(error);
        }
    });
};

const getCrypto = async (crypto: string, mod: any): Promise<any> => {
    return new Promise(async (resolve) => {
        try {
            const res = await gpc(crypto, {
                json: { mod: typeof mod === 'number' ? mod : Array.from(mod) },
            } as any);
            resolve(res);
        } catch (error) {
            resolve('error on Blockchain Hash Validate');
        }
    });
};

// Export functions
export { getCrypto, getPublicSeed };
