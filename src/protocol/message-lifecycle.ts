import { MessageLifecycleState } from "../enums";

export const MESSAGE_LIFECYCLE_ORDER: MessageLifecycleState[] = [
  MessageLifecycleState.CREATED,
  MessageLifecycleState.SENT,
  MessageLifecycleState.DELIVERED,
  MessageLifecycleState.READ
];

export const TERMINAL_FAILURE_STATE = MessageLifecycleState.FAILED;
