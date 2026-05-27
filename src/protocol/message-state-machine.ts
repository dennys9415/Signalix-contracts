import { MessageLifecycleState } from "../enums";

export const VALID_MESSAGE_STATE_TRANSITIONS: Record<MessageLifecycleState, MessageLifecycleState[]> = {
  [MessageLifecycleState.CREATED]: [MessageLifecycleState.SENT, MessageLifecycleState.FAILED],
  [MessageLifecycleState.SENT]: [MessageLifecycleState.DELIVERED, MessageLifecycleState.FAILED],
  [MessageLifecycleState.DELIVERED]: [MessageLifecycleState.READ],
  [MessageLifecycleState.READ]: [],
  [MessageLifecycleState.FAILED]: []
};

export function isValidMessageStateTransition(
  from: MessageLifecycleState,
  to: MessageLifecycleState
): boolean {
  return VALID_MESSAGE_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function shouldMessageStateAdvance(
  current: MessageLifecycleState,
  incoming: MessageLifecycleState
): boolean {
  const rank: Record<MessageLifecycleState, number> = {
    [MessageLifecycleState.CREATED]: 0,
    [MessageLifecycleState.SENT]: 1,
    [MessageLifecycleState.DELIVERED]: 2,
    [MessageLifecycleState.READ]: 3,
    [MessageLifecycleState.FAILED]: -1
  };

  return rank[incoming] > rank[current];
}
