async function main() {
  const ProductTracking = await ethers.getContractFactory("ProductTracking");
  const productTracking = await ProductTracking.deploy();

  await productTracking.deployed();

  console.log("ProductTracking contract deployed to:", productTracking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
