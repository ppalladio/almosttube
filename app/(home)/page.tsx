import Image from "next/image";

export default function Home() {
  return (
    <div>
		<Image src={"/next.svg"} height={50} width={50} alt="logo"/>
		<h1 className="text-xl font-semibold tracking-tight">
			AlmostTube
		</h1>
	 
	</div>
  );
}
