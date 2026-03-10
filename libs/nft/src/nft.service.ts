import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NftMetadataPayload } from '@app/database';
import { ethers } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { abi } = require('../../../artifacts/contracts/LuxuryProductPassport.sol/LuxuryProductPassport.json');

interface MintFromUploadParams {
  file: any;
  name: string;
  description?: string;
  externalUrl?: string;
  attributesJson?: string;
}

interface MintResult {
  imageCid: string;
  metadataCid: string;
  tokenUri: string;
  txHash: string;
  blockNumber: number;
}

@Injectable()
export class NftService {
  private readonly pinataJwt = process.env.PINATA_JWT;
  private readonly pinataApiKey = process.env.PINATA_API_KEY;
  private readonly pinataApiSecret = process.env.PINATA_API_SECRET;

  private buildPinataHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.pinataJwt) {
      headers.Authorization = `Bearer ${this.pinataJwt}`;
      return headers;
    }

    if (this.pinataApiKey && this.pinataApiSecret) {
      headers['pinata_api_key'] = this.pinataApiKey;
      headers['pinata_secret_api_key'] = this.pinataApiSecret;
      return headers;
    }

    throw new InternalServerErrorException(
      'PINATA_JWT hoặc PINATA_API_KEY/PINATA_API_SECRET chưa được cấu hình',
    );
  }

  private async uploadFileToPinata(file: any): Promise<string> {
    if (!file) {
      throw new BadRequestException('File là bắt buộc để upload lên Pinata');
    }

    const headers = this.buildPinataHeaders();
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });

    formData.append('file', blob, file.originalname);

    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers,
        body: formData as any,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new InternalServerErrorException(
        `Upload file lên Pinata thất bại: ${response.status} - ${text}`,
      );
    }

    const data = (await response.json()) as { IpfsHash?: string };
    if (!data.IpfsHash) {
      throw new InternalServerErrorException(
        'Không nhận được IpfsHash từ Pinata khi upload file',
      );
    }

    return data.IpfsHash;
  }

  private async uploadJsonToPinata(
    metadata: NftMetadataPayload,
  ): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.buildPinataHeaders(),
    };

    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(metadata),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new InternalServerErrorException(
        `Upload metadata lên Pinata thất bại: ${response.status} - ${text}`,
      );
    }

    const data = (await response.json()) as { IpfsHash?: string };
    if (!data.IpfsHash) {
      throw new InternalServerErrorException(
        'Không nhận được IpfsHash từ Pinata khi upload metadata',
      );
    }

    return data.IpfsHash;
  }

  async mintFromUpload(params: MintFromUploadParams): Promise<MintResult> {
    const { file, name, description, externalUrl, attributesJson } = params;

    if (!name) {
      throw new BadRequestException('name là bắt buộc');
    }

    if (!file || !file.buffer) {
      throw new BadRequestException('file media là bắt buộc');
    }

    // 1. Upload ảnh/video lên Pinata để lấy image CID
    const imageCid = await this.uploadFileToPinata(file);
    const imageUri = `ipfs://${imageCid}`;

    // 2. Build metadata và upload JSON metadata lên Pinata
    let attributes: NftMetadataPayload['attributes'];
    if (attributesJson) {
      try {
        attributes = JSON.parse(attributesJson);
      } catch {
        throw new BadRequestException(
          'attributesJson phải là chuỗi JSON hợp lệ',
        );
      }
    }

    const metadata: NftMetadataPayload = {
      name,
      description,
      image: imageUri,
      external_url: externalUrl,
      attributes,
    };

    const metadataCid = await this.uploadJsonToPinata(metadata);
    const tokenUri = `ipfs://${metadataCid}`;

    // 3. Gọi contract để mint NFT như scripts/mint.js
    const rpcUrl = process.env.POLYGON_MAINNET_RPC_URL;
    const privateKey = process.env.METAMASK_PRIVATE_KEY;
    const receiver = process.env.METAMASK_RECEIVER_ADDRESS;
    const contractAddress = process.env.LUXURY_PRODUCT_PASSPORT_ADDRESS;

    if (!rpcUrl || !privateKey || !receiver || !contractAddress) {
      throw new InternalServerErrorException(
        'Thiếu config on-chain (RPC URL / PRIVATE_KEY / RECEIVER / CONTRACT_ADDRESS)',
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.mint(receiver, tokenUri);
    const receipt = await tx.wait();

    return {
      imageCid,
      metadataCid,
      tokenUri,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  }
}

