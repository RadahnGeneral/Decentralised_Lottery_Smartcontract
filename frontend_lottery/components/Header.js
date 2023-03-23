import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
      <h3>Decentralised Lottery</h3>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
