/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { CanExecuteRelayResponse, CosmosMsgForEmpty, BankMsg, Uint128, StakingMsg, DistributionMsg, WasmMsg, Binary, Coin, Empty, ExecuteMsgForEmpty, Addr, RelayTransaction, Guardians, MultiSig, InfoResponse, ContractVersion, InstantiateMsg, CreateWalletMsg, QueryMsg, Uint64 } from "./Proxy.types";
export interface ProxyReadOnlyInterface {
  contractAddress: string;
  info: () => Promise<InfoResponse>;
  canExecuteRelay: ({
    sender
  }: {
    sender: string;
  }) => Promise<CanExecuteRelayResponse>;
}
export class ProxyQueryClient implements ProxyReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.info = this.info.bind(this);
    this.canExecuteRelay = this.canExecuteRelay.bind(this);
  }

  info = async (): Promise<InfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      info: {}
    });
  };
  canExecuteRelay = async ({
    sender
  }: {
    sender: string;
  }): Promise<CanExecuteRelayResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      can_execute_relay: {
        sender
      }
    });
  };
}
export interface ProxyInterface extends ProxyReadOnlyInterface {
  contractAddress: string;
  sender: string;
  execute: ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  revertFreezeStatus: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  relay: ({
    transaction
  }: {
    transaction: RelayTransaction;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  rotateUserKey: ({
    newUserAddress
  }: {
    newUserAddress: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  addRelayer: ({
    newRelayerAddress
  }: {
    newRelayerAddress: Addr;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  removeRelayer: ({
    relayerAddress
  }: {
    relayerAddress: Addr;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateGuardians: ({
    guardians,
    newMultisigCodeId
  }: {
    guardians: Guardians;
    newMultisigCodeId?: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateLabel: ({
    newLabel
  }: {
    newLabel: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class ProxyClient extends ProxyQueryClient implements ProxyInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.execute = this.execute.bind(this);
    this.revertFreezeStatus = this.revertFreezeStatus.bind(this);
    this.relay = this.relay.bind(this);
    this.rotateUserKey = this.rotateUserKey.bind(this);
    this.addRelayer = this.addRelayer.bind(this);
    this.removeRelayer = this.removeRelayer.bind(this);
    this.updateGuardians = this.updateGuardians.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
  }

  execute = async ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      execute: {
        msgs
      }
    }, fee, memo, funds);
  };
  revertFreezeStatus = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      revert_freeze_status: {}
    }, fee, memo, funds);
  };
  relay = async ({
    transaction
  }: {
    transaction: RelayTransaction;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      relay: {
        transaction
      }
    }, fee, memo, funds);
  };
  rotateUserKey = async ({
    newUserAddress
  }: {
    newUserAddress: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      rotate_user_key: {
        new_user_address: newUserAddress
      }
    }, fee, memo, funds);
  };
  addRelayer = async ({
    newRelayerAddress
  }: {
    newRelayerAddress: Addr;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      add_relayer: {
        new_relayer_address: newRelayerAddress
      }
    }, fee, memo, funds);
  };
  removeRelayer = async ({
    relayerAddress
  }: {
    relayerAddress: Addr;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_relayer: {
        relayer_address: relayerAddress
      }
    }, fee, memo, funds);
  };
  updateGuardians = async ({
    guardians,
    newMultisigCodeId
  }: {
    guardians: Guardians;
    newMultisigCodeId?: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_guardians: {
        guardians,
        new_multisig_code_id: newMultisigCodeId
      }
    }, fee, memo, funds);
  };
  updateLabel = async ({
    newLabel
  }: {
    newLabel: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_label: {
        new_label: newLabel
      }
    }, fee, memo, funds);
  };
}