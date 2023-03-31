import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="border-b-2 flex flex-row">
      <h2 className="py-4 px-4 font-blog text-3xl">Decentralised Lottery</h2>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
