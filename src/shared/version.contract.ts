export type ContractStage = "MVP" | "BETA" | "PROD";

export interface ContractVersion {
  version: string;
  stage: ContractStage;
  updatedAt: string;
}
