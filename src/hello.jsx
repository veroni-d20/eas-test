import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useState } from "react";
import { ethers } from "ethers";
const EASContractAddress = "0xaEF4103A04090071165F78D45D83A0C0782c2B2a";

function Hello() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attestationUID, setAttestationUID] = useState();

  const handleSubmit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = new ethers.Wallet(
      "e340179cefa235ed5fe915558a3b711688ff6f924097a180ed109f787a8a4edb",
      provider
    );

    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("string name, string message");
    const encodedData = schemaEncoder.encodeData([
      { name: "name", value: name, type: "string" },
      { name: "message", value: message, type: "string" },
    ]);

    const schemaUID =
      "0xb28844791177681bd44d983e8aaa017f6a378e297271a46fd20d81a5cbadc386";

    const uid =
      "0x934ae35c8defa799605b1d213e3dde5500894dc3c602d0df6a52ac6ce5b86069";

    const attestation = await eas.getAttestation(uid);

    console.log(attestation);

    // const offchain = await eas.getOffchain();

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: 0,
        revocable: true,
        data: encodedData,
      },
    });

    // const offchainAttestation = await offchain.signOffchainAttestation(
    //   {
    //     recipient: address,
    //     // Unix timestamp of when attestation expires. (0 for no expiration)
    //     expirationTime: 0,
    //     // Unix timestamp of current time
    //     time: 1699597755,
    //     revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    //     version: 1,
    //     nonce: 0,
    //     schema: schemaUID,
    //     refUID:
    //       "0x0000000000000000000000000000000000000000000000000000000000000000",
    //     data: encodedData,
    //   },
    //   signer
    // );

    setLoading(true);

    // console.log(offchainAttestation);

    const newAttestationUID = await tx.wait();

    console.log(newAttestationUID);

    setLoading(false);

    setAttestationUID(newAttestationUID);
  };

  return (
    <div className="App">
      {/* <ConnectButton className="m-5" /> */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
            </div>
            <div className="mt-2">
              <input
                id="address"
                name="address"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Message
              </label>
            </div>
            <div className="mt-2">
              <input
                id="message"
                name="message"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit}
            >
              Sign in
            </button>
            {loading && <p className="mt-4">Loading...</p>}
            {attestationUID && (
              <p className="mt-4">New Attestation UID: {attestationUID}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Hello;
