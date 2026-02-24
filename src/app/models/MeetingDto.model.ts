export interface MeetingDto {
  id?: number;
  meetingId?: string;
  meetingCode?: string;
  title?: string;
  description?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  hostId?: number;
  hostName?: string;
  coHostIds?: number[];
  participantIds?: number[];
  locked?: boolean;
  started?: boolean;
  lobbyEnabled?: boolean;
  recordingEnabled?: boolean;
  password?: string;
  joinUrl?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  type?: MeetingType;
  status?: MeetingStatus;
  participants?: ParticipantDto[];
}

export interface ParticipantDto {
  userId?: number;
  username?: string;
  role?: string;
  status?: string;
  audioMuted?: boolean;
  videoOff?: boolean;
  handRaised?: boolean;
  screenSharing?: boolean;
  inWaitingRoom?: boolean;
  joinTime?: Date | string;
}

export enum MeetingType {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED'
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}