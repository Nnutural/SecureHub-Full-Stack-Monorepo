import { useEffect } from 'react';
import type {
  ArtifactEvent,
  DoneEvent,
  ErrorEvent as SSEErrorEvent,
  EvidenceChunkDTO,
  EvidenceEvent,
  ProgressEvent,
  SSEEvent,
  TokenEvent,
  TraceEvent,
} from './sse.types';

export type {
  AgentRunDTO,
  ArtifactEvent,
  DoneEvent,
  ErrorEvent,
  EvidenceChunkDTO,
  EvidenceEvent,
  ProgressEvent,
  ResourceType,
  SSEEvent,
  TokenEvent,
  TraceEvent,
} from './sse.types';

const EVENT_NAMES = ['progress', 'evidence', 'token', 'artifact', 'trace', 'done', 'error'] as const;

type EventName = (typeof EVENT_NAMES)[number];
type EventByName<T extends EventName> = Extract<SSEEvent, { event: T }>;

export type SSEHandlers = {
  onToken?: (event: TokenEvent['data']) => void;
  onEvidence?: (event: EvidenceChunkDTO) => void;
  onProgress?: (event: ProgressEvent['data']) => void;
  onArtifact?: (event: ArtifactEvent['data']) => void;
  onTrace?: (event: TraceEvent['data']) => void;
  onDone?: (event: DoneEvent['data']) => void;
  onError?: (event: SSEErrorEvent['data']) => void;
};

function parseMessage<T>(message: MessageEvent<string>): T {
  return JSON.parse(message.data || '{}') as T;
}

function hasMessageData(event: Event): event is MessageEvent<string> {
  return 'data' in event && typeof (event as MessageEvent<string>).data === 'string';
}

function normalizeEvidence(data: EvidenceEvent['data'] | EvidenceChunkDTO): EvidenceEvent['data'] {
  return Array.isArray(data) ? data : [data];
}

export function openSSE(
  url: string,
  opts?: {
    onEvent: (e: SSEEvent) => void;
    onError?: (e: unknown) => void;
  },
): () => void {
  const source = new EventSource(url);

  for (const eventName of EVENT_NAMES) {
    source.addEventListener(eventName, (message) => {
      if (!hasMessageData(message)) {
        opts?.onError?.(message);
        return;
      }
      try {
        const data = parseMessage<EventByName<typeof eventName>['data']>(message);
        const normalized =
          eventName === 'evidence' ? normalizeEvidence(data as EvidenceEvent['data']) : data;
        opts?.onEvent({ event: eventName, data: normalized } as SSEEvent);
      } catch (error) {
        opts?.onError?.(error);
      }
    });
  }

  source.onerror = (event) => {
    opts?.onError?.(event);
  };

  return () => source.close();
}

export function useSSE(
  url: string | null | undefined,
  opts?: {
    onEvent: (e: SSEEvent) => void;
    onError?: (e: unknown) => void;
  },
): void {
  useEffect(() => {
    if (!url) return undefined;
    return openSSE(url, opts);
  }, [url, opts]);
}

export function streamTask(url: string, handlers: SSEHandlers): () => void {
  return openSSE(url, {
    onEvent(event) {
      switch (event.event) {
        case 'token':
          handlers.onToken?.(event.data);
          break;
        case 'evidence':
          for (const chunk of event.data) {
            handlers.onEvidence?.(chunk);
          }
          break;
        case 'progress':
          handlers.onProgress?.(event.data);
          break;
        case 'artifact':
          handlers.onArtifact?.(event.data);
          break;
        case 'trace':
          handlers.onTrace?.(event.data);
          break;
        case 'done':
          handlers.onDone?.(event.data);
          break;
        case 'error':
          handlers.onError?.(event.data);
          break;
      }
    },
    onError(error) {
      handlers.onError?.({
        code: 'sse_error',
        message: 'SSE connection failed',
        recoverable: true,
      });
      console.error(error);
    },
  });
}
