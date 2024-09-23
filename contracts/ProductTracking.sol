// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTracking {
    struct Product {
        string name;
        string productionDate;
        string expiryDate;
        string medicalInfo;
        address owner;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCounter;

    event ProductAdded(uint256 productId, string name, address owner);

    function addProduct(
        string memory _name,
        string memory _productionDate,
        string memory _expiryDate,
        string memory _medicalInfo
    ) public returns (uint256) {
        productCounter++;
        products[productCounter] = Product(
            _name,
            _productionDate,
            _expiryDate,
            _medicalInfo,
            msg.sender
        );
        
        emit ProductAdded(productCounter, _name, msg.sender);
        return productCounter;
    }

    function getProduct(uint256 _productId)
        public
        view
        returns (
            string memory name,
            string memory productionDate,
            string memory expiryDate,
            string memory medicalInfo,
            address owner
        )
    {
        Product memory product = products[_productId];
        return (
            product.name,
            product.productionDate,
            product.expiryDate,
            product.medicalInfo,
            product.owner
        );
    }
}
