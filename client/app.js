import { ethers } from "ethers";

const { ethereum } = window;
const ADDRESS_PERMISSION_PREFIX = "0x4b80742d0000000082ac0000";
const SIGN_PERMISSION = 0x200;

const account = { loggedIn: false }

document.getElementById("profile-address").addEventListener("keyup", async (event) => {
    const profileAddress = event.target.value;
    console.log(profileAddress);
    if (ethers.utils.isAddress(profileAddress)) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const permissionKey = ADDRESS_PERMISSION_PREFIX + ethereum.selectedAddress.slice(2);

        const provider = new ethers.providers.Web3Provider(ethereum);

        const data = await getData(provider, profileAddress, permissionKey);
        if (data === "0x") {
            alert("No profile permissions found on selected address: " + ethereum.selectedAddress);
            return;
        }

        const hasSignPermission = Boolean(BigInt(SIGN_PERMISSION) & BigInt(data));

        if (hasSignPermission) {
            const signer = await provider.getSigner(0);
            signer.signMessage("Verify your account on Nomad to use your Universal Profile").then(async () => {
                account.loggedIn = true;
            }).catch(console.log);
        } else {
            alert("Sign permission not found on selected address: " + ethereum.selectedAddress);
        }
    }
});


const iface = new ethers.utils.Interface([
    "function getData(bytes32[] memory _keys) view returns (bytes[] memory values)"
]);

async function getData(provider, profileAddress, key) {
    const calldata = iface.encodeFunctionData("getData", [
        [key]
    ]);

    const result = await provider.call({
        to: profileAddress,
        data: calldata
    })

    const [[data]] = iface.decodeFunctionResult("getData", result);
    return data;
}