import { EventEmitter } from "node:events";
import { Socket } from 'node:net';

/** Base class for an playeraccount */
export class Client extends EventEmitter {
    public constructor(name: string, password: string): Client;
    private #name: string;
    private #password: string;
    private _socket: Socket;
    /** Login with your credentials */
    public connect(): Promise<Client>;
    public movements: MovementManager;
    public alliances: AllianceManager;
    public players: PlayerManager;
    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    public addListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    private emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;
}

export class BaseManager extends EventEmitter {
    private _client: Client;
    private constructor(client: Client): this;
}

export class MovementManager extends BaseManager {
    private constructor(client: Client): this;
    private #movements: Movement[];
    public on<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;
    public addListener<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;
    private emit<K extends keyof MovementEvents>(eventName: K, ...args: MovementEvents[K]): boolean;
    /** Returns all movements */
    public get(): Movement[];
    private _add_or_update(_movements: Movement[]): void;
}

export class AllianceManager extends BaseManager {
    private constructor(client: Client): this;
    private #alliances: Alliance[];
    public getById(id: number): Promise<Alliance>;
    public find(name: string): Promise<Alliance>;
    private _add_or_update(_alliance: Alliance): void;
    public get mine(): MyAlliance;
}

export class PlayerManager extends BaseManager {
    private constructor(client: Client): this;
    private #players: Player[];
    public getById(id: number): Promise<Player>;
    public find(name: string): Promise<Player>;
    private _add_or_update(_player: Player): void;
    //public get me(): Player;
}

export type Movement = BasicMovement | ArmyAttackMovement | ArmyTravelMovement;

export class BasicMovement {
    private constructor(client: Client, data): this;
    public movementId: number;
    public movementType: number;
    public arrivalTime: Date;
    public departureTime: Date;
    public direction: number;
    public sourceArea: Mapobject;
    public targetArea: Mapobject;
    public ownerArea: Mapobject;
    public distance: number;
    public kingdomId: number;
    public horseBoosterWodId: number;
    public endWaitTime?: Date;
    public lord?: Lord;
}

export class ArmyAttackMovement extends BasicMovement {
    private constructor(client: Client, data): this;
    public army: CompactArmy;
    public armyState: number;
    public attackType: number;
    public guessedSize: number;
    public isForceCancelable: boolean;
    public isShadowMovement: boolean;
}

export class ArmyTravelMovement extends BasicMovement {
    private constructor(client: Client, data): this;
    public army: CompactArmy;
    public goods: Good[];
}

export class Alliance {
    private constructor(client: Client, data): this;
    public allianceId: number;
    public allianceName: string;
    public languageId: string;
    public memberLevel: number;
    public memberList: AllianceMember[];
    public allianceStatusToOwnAlliance: number;
    public allianceFamePoints: number;
    public allianceFamePointsHighestReached: number
    public canInvitedForHardPact: boolean;
    public canInvitedForSoftPact: boolean;
    public isSearchingMembers: boolean;
    public get landmarks(): Mapobject[];
    public isOpenAlliance: boolean;
    public freeRenames: number;
    public might: number;
    private _add_or_update_landmarks(landmarks: WorldmapObject[]): void;
}

export class MyAlliance extends Alliance {

}

export class AllianceMember {
    private constructor(client: Client, data): this;
    public playerId: number;
    public playerName: string;
    public playerLevel: number;
    public paragonLevel: number;
    public alliance: Alliance;
    public allianceRank: number;
}

export class ChatMessage {
    public message: string;
    public sendDate: Date;
    public senderPlayerId: number;
    public senderPlayerName: string;
}

export class CompactArmy {
    private constructor(client: Client, data): this;
    public left: { unit: Unit, count: number }[];
    public middle: { unit: Unit, count: number }[];
    public right: { unit: Unit, count: number }[];
    public supportTools: { unit: Unit, count: number }[];
    public armySize: number;
}

export class Good {
    name: string;
    count: number;
}

export class Lord {

}

export class Player {
    playerId: number;
    isDummy: boolean;
    playerName: string;
    playerLevel: number;
    paragonLevel: number;
    noobEndTime?: Date;
    honor: number;
    famePoints: number;
    highestFamePoints: number;
    isRuin: boolean;
    allianceId: number;
    allianceName: string;
    allianceRank: number;
    isSearchingAlliance: number;
    peaceEndTime?: Date;
    castles: CastleMapobject[] | CapitalMapobject[];
    villages: {
        public: {
            village: VillageMapobject,
            units?: { unit: Unit, count: number }[]
        }[]
        private: { privateVillageId: number, uniqueId: number }[]
    };
    kingstowers: {
        kingstower: KingstowerMapobject;
        units?: { unit: Unit, count: number }[];
    }[];
    monuments: {
        monument: MonumentMapobject;
        units?: { unit: Unit, count: number }[];
    }[];
    hasPremiumFlag: boolean;
    might: number;
    achievementPoints: number;
    prefixTitleId: number;
    suffixTitleId: number;
    relocateDurationEndTime?: Date;
    factionId?: number;
    factionMainCampId?: number;
    factionIsSpectator?: boolean;
    factionProtectionStatus?: number;
    factionProtectionEndTime?: Date;
    factionNoobProtectionEndTime?: Date;
}


export class Unit {
    private constructor(client: Client, wodId: number);
    public wodId: number;
}

//#region Mapobject
export type Mapobject = BasicMapobject | BossDungeonMapobject | CapitalMapobject | CastleMapobject | DungeonMapobject | EmptyMapobject | InteractiveMapobject | KingstowerMapobject | MonumentMapobject | VillageMapobject;

export class BasicMapobject {
    public areaType: number;
    public position: { X: number, Y: number };
}

export class BossDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public attackCooldownEnd?: Date;
    public defeaterPlayerId: number;
    public kingdomId: number;
}

export class CapitalMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public keepLevel: number;
    public wallLevel: number;
    public gateLevel: number;
    public towerLevel: number;
    public moatLevel: number;
    public customName: string;
    public attackCooldownEnd?: Date;
    public sabotageCooldownEnd?: Date;
    public lastSpyDate?: Date;
    public occupierId: number;
    public equipmentId: number;
    public kingdomId: number;
    public depletionTimeEnd?: Date;
    public influencePoints: number;
}

export class CastleMapobject extends InteractiveMapobject {

}

export class DungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public kingdomId: number;
}

export class EmptyMapobject extends BasicMapobject {

}

export class InteractiveMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public keepLevel: number;
    public wallLevel: number;
    public gateLevel: number;
    public towerLevel: number;
    public moatLevel: number;
    public customName: string;
    public attackCooldownEnd?: Date;
    public sabotageCooldownEnd?: Date;
    public lastSpyDate?: Date;
    public occupierId: number;
    public equipmentId: number;
    public kingdomId: number;
    public outpostType: number;
}

export class KingstowerMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

export class MonumentMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public monumentType: number;
    public monumentLevel: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

export class VillageMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public villageType: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}
//#endregion

export interface ClientEvents {
    serverShutdown: [];
    connected: [];
    chatMessage: [message: ChatMessage]
}

export interface MovementEvents {
    movementAdd: [movement: Movement];
    movementUpdate: [oldMovement: Movement, newMovement: Movement];
}

export interface ConstantsEvents {
    /** Equivalent of MOVEMENT_ADD */
    MOVEMENT_NEW: "movementAdd";
    MOVEMENT_ADD: "movementAdd";
    MOVEMENT_UPDATE: "movementUpdate";
}

export const Constants: {
    Events: ConstantsEvents;
}