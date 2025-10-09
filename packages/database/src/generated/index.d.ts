
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model Business
 * 
 */
export type Business = $Result.DefaultSelection<Prisma.$BusinessPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model InvoiceItem
 * 
 */
export type InvoiceItem = $Result.DefaultSelection<Prisma.$InvoiceItemPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model BulkInvoiceBatch
 * 
 */
export type BulkInvoiceBatch = $Result.DefaultSelection<Prisma.$BulkInvoiceBatchPayload>
/**
 * Model BulkInvoiceItem
 * 
 */
export type BulkInvoiceItem = $Result.DefaultSelection<Prisma.$BulkInvoiceItemPayload>
/**
 * Model SystemConfig
 * 
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model FBRScenario
 * 
 */
export type FBRScenario = $Result.DefaultSelection<Prisma.$FBRScenarioPayload>
/**
 * Model FBRBusinessScenarioMapping
 * 
 */
export type FBRBusinessScenarioMapping = $Result.DefaultSelection<Prisma.$FBRBusinessScenarioMappingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SubscriptionPlan: {
  FREE: 'FREE',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
};

export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan]


export const IntegrationMode: {
  LOCAL: 'LOCAL',
  SANDBOX: 'SANDBOX',
  PRODUCTION: 'PRODUCTION'
};

export type IntegrationMode = (typeof IntegrationMode)[keyof typeof IntegrationMode]


export const RegistrationType: {
  REGISTERED: 'REGISTERED',
  UNREGISTERED: 'UNREGISTERED'
};

export type RegistrationType = (typeof RegistrationType)[keyof typeof RegistrationType]


export const InvoiceStatus: {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  VALIDATED: 'VALIDATED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]


export const ProcessingStatus: {
  UPLOADING: 'UPLOADING',
  PARSING: 'PARSING',
  VALIDATING: 'VALIDATING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED'
};

export type ProcessingStatus = (typeof ProcessingStatus)[keyof typeof ProcessingStatus]


export const ValidationStatus: {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  FAILED: 'FAILED'
};

export type ValidationStatus = (typeof ValidationStatus)[keyof typeof ValidationStatus]

}

export type SubscriptionPlan = $Enums.SubscriptionPlan

export const SubscriptionPlan: typeof $Enums.SubscriptionPlan

export type IntegrationMode = $Enums.IntegrationMode

export const IntegrationMode: typeof $Enums.IntegrationMode

export type RegistrationType = $Enums.RegistrationType

export const RegistrationType: typeof $Enums.RegistrationType

export type InvoiceStatus = $Enums.InvoiceStatus

export const InvoiceStatus: typeof $Enums.InvoiceStatus

export type ProcessingStatus = $Enums.ProcessingStatus

export const ProcessingStatus: typeof $Enums.ProcessingStatus

export type ValidationStatus = $Enums.ValidationStatus

export const ValidationStatus: typeof $Enums.ValidationStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs>;

  /**
   * `prisma.business`: Exposes CRUD operations for the **Business** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Businesses
    * const businesses = await prisma.business.findMany()
    * ```
    */
  get business(): Prisma.BusinessDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs>;

  /**
   * `prisma.invoiceItem`: Exposes CRUD operations for the **InvoiceItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceItems
    * const invoiceItems = await prisma.invoiceItem.findMany()
    * ```
    */
  get invoiceItem(): Prisma.InvoiceItemDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.bulkInvoiceBatch`: Exposes CRUD operations for the **BulkInvoiceBatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BulkInvoiceBatches
    * const bulkInvoiceBatches = await prisma.bulkInvoiceBatch.findMany()
    * ```
    */
  get bulkInvoiceBatch(): Prisma.BulkInvoiceBatchDelegate<ExtArgs>;

  /**
   * `prisma.bulkInvoiceItem`: Exposes CRUD operations for the **BulkInvoiceItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BulkInvoiceItems
    * const bulkInvoiceItems = await prisma.bulkInvoiceItem.findMany()
    * ```
    */
  get bulkInvoiceItem(): Prisma.BulkInvoiceItemDelegate<ExtArgs>;

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemConfigs
    * const systemConfigs = await prisma.systemConfig.findMany()
    * ```
    */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;

  /**
   * `prisma.fBRScenario`: Exposes CRUD operations for the **FBRScenario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FBRScenarios
    * const fBRScenarios = await prisma.fBRScenario.findMany()
    * ```
    */
  get fBRScenario(): Prisma.FBRScenarioDelegate<ExtArgs>;

  /**
   * `prisma.fBRBusinessScenarioMapping`: Exposes CRUD operations for the **FBRBusinessScenarioMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FBRBusinessScenarioMappings
    * const fBRBusinessScenarioMappings = await prisma.fBRBusinessScenarioMapping.findMany()
    * ```
    */
  get fBRBusinessScenarioMapping(): Prisma.FBRBusinessScenarioMappingDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserSession: 'UserSession',
    Business: 'Business',
    Customer: 'Customer',
    Invoice: 'Invoice',
    InvoiceItem: 'InvoiceItem',
    Product: 'Product',
    BulkInvoiceBatch: 'BulkInvoiceBatch',
    BulkInvoiceItem: 'BulkInvoiceItem',
    SystemConfig: 'SystemConfig',
    AuditLog: 'AuditLog',
    FBRScenario: 'FBRScenario',
    FBRBusinessScenarioMapping: 'FBRBusinessScenarioMapping'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "userSession" | "business" | "customer" | "invoice" | "invoiceItem" | "product" | "bulkInvoiceBatch" | "bulkInvoiceItem" | "systemConfig" | "auditLog" | "fBRScenario" | "fBRBusinessScenarioMapping"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      Business: {
        payload: Prisma.$BusinessPayload<ExtArgs>
        fields: Prisma.BusinessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findFirst: {
            args: Prisma.BusinessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findMany: {
            args: Prisma.BusinessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          create: {
            args: Prisma.BusinessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          createMany: {
            args: Prisma.BusinessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BusinessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          delete: {
            args: Prisma.BusinessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          update: {
            args: Prisma.BusinessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          deleteMany: {
            args: Prisma.BusinessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BusinessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          aggregate: {
            args: Prisma.BusinessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusiness>
          }
          groupBy: {
            args: Prisma.BusinessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceItem: {
        payload: Prisma.$InvoiceItemPayload<ExtArgs>
        fields: Prisma.InvoiceItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findFirst: {
            args: Prisma.InvoiceItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findMany: {
            args: Prisma.InvoiceItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          create: {
            args: Prisma.InvoiceItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          createMany: {
            args: Prisma.InvoiceItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          delete: {
            args: Prisma.InvoiceItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          update: {
            args: Prisma.InvoiceItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          aggregate: {
            args: Prisma.InvoiceItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceItem>
          }
          groupBy: {
            args: Prisma.InvoiceItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceItemCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      BulkInvoiceBatch: {
        payload: Prisma.$BulkInvoiceBatchPayload<ExtArgs>
        fields: Prisma.BulkInvoiceBatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BulkInvoiceBatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BulkInvoiceBatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          findFirst: {
            args: Prisma.BulkInvoiceBatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BulkInvoiceBatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          findMany: {
            args: Prisma.BulkInvoiceBatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>[]
          }
          create: {
            args: Prisma.BulkInvoiceBatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          createMany: {
            args: Prisma.BulkInvoiceBatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BulkInvoiceBatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>[]
          }
          delete: {
            args: Prisma.BulkInvoiceBatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          update: {
            args: Prisma.BulkInvoiceBatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          deleteMany: {
            args: Prisma.BulkInvoiceBatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BulkInvoiceBatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BulkInvoiceBatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceBatchPayload>
          }
          aggregate: {
            args: Prisma.BulkInvoiceBatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBulkInvoiceBatch>
          }
          groupBy: {
            args: Prisma.BulkInvoiceBatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<BulkInvoiceBatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.BulkInvoiceBatchCountArgs<ExtArgs>
            result: $Utils.Optional<BulkInvoiceBatchCountAggregateOutputType> | number
          }
        }
      }
      BulkInvoiceItem: {
        payload: Prisma.$BulkInvoiceItemPayload<ExtArgs>
        fields: Prisma.BulkInvoiceItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BulkInvoiceItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BulkInvoiceItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          findFirst: {
            args: Prisma.BulkInvoiceItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BulkInvoiceItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          findMany: {
            args: Prisma.BulkInvoiceItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>[]
          }
          create: {
            args: Prisma.BulkInvoiceItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          createMany: {
            args: Prisma.BulkInvoiceItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BulkInvoiceItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>[]
          }
          delete: {
            args: Prisma.BulkInvoiceItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          update: {
            args: Prisma.BulkInvoiceItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          deleteMany: {
            args: Prisma.BulkInvoiceItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BulkInvoiceItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BulkInvoiceItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BulkInvoiceItemPayload>
          }
          aggregate: {
            args: Prisma.BulkInvoiceItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBulkInvoiceItem>
          }
          groupBy: {
            args: Prisma.BulkInvoiceItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BulkInvoiceItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BulkInvoiceItemCountArgs<ExtArgs>
            result: $Utils.Optional<BulkInvoiceItemCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      FBRScenario: {
        payload: Prisma.$FBRScenarioPayload<ExtArgs>
        fields: Prisma.FBRScenarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FBRScenarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FBRScenarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          findFirst: {
            args: Prisma.FBRScenarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FBRScenarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          findMany: {
            args: Prisma.FBRScenarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>[]
          }
          create: {
            args: Prisma.FBRScenarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          createMany: {
            args: Prisma.FBRScenarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FBRScenarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>[]
          }
          delete: {
            args: Prisma.FBRScenarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          update: {
            args: Prisma.FBRScenarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          deleteMany: {
            args: Prisma.FBRScenarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FBRScenarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FBRScenarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRScenarioPayload>
          }
          aggregate: {
            args: Prisma.FBRScenarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFBRScenario>
          }
          groupBy: {
            args: Prisma.FBRScenarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<FBRScenarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.FBRScenarioCountArgs<ExtArgs>
            result: $Utils.Optional<FBRScenarioCountAggregateOutputType> | number
          }
        }
      }
      FBRBusinessScenarioMapping: {
        payload: Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>
        fields: Prisma.FBRBusinessScenarioMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FBRBusinessScenarioMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FBRBusinessScenarioMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          findFirst: {
            args: Prisma.FBRBusinessScenarioMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FBRBusinessScenarioMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          findMany: {
            args: Prisma.FBRBusinessScenarioMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>[]
          }
          create: {
            args: Prisma.FBRBusinessScenarioMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          createMany: {
            args: Prisma.FBRBusinessScenarioMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FBRBusinessScenarioMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>[]
          }
          delete: {
            args: Prisma.FBRBusinessScenarioMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          update: {
            args: Prisma.FBRBusinessScenarioMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          deleteMany: {
            args: Prisma.FBRBusinessScenarioMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FBRBusinessScenarioMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FBRBusinessScenarioMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FBRBusinessScenarioMappingPayload>
          }
          aggregate: {
            args: Prisma.FBRBusinessScenarioMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFBRBusinessScenarioMapping>
          }
          groupBy: {
            args: Prisma.FBRBusinessScenarioMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<FBRBusinessScenarioMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.FBRBusinessScenarioMappingCountArgs<ExtArgs>
            result: $Utils.Optional<FBRBusinessScenarioMappingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    businesses: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    businesses?: boolean | UserCountOutputTypeCountBusinessesArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBusinessesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }


  /**
   * Count Type BusinessCountOutputType
   */

  export type BusinessCountOutputType = {
    invoices: number
    customers: number
    products: number
  }

  export type BusinessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BusinessCountOutputTypeCountInvoicesArgs
    customers?: boolean | BusinessCountOutputTypeCountCustomersArgs
    products?: boolean | BusinessCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessCountOutputType
     */
    select?: BusinessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountCustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    invoices: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | CustomerCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    items: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InvoiceCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
  }


  /**
   * Count Type BulkInvoiceBatchCountOutputType
   */

  export type BulkInvoiceBatchCountOutputType = {
    items: number
  }

  export type BulkInvoiceBatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | BulkInvoiceBatchCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * BulkInvoiceBatchCountOutputType without action
   */
  export type BulkInvoiceBatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatchCountOutputType
     */
    select?: BulkInvoiceBatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BulkInvoiceBatchCountOutputType without action
   */
  export type BulkInvoiceBatchCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BulkInvoiceItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLogin: Date | null
    subscriptionPlan: $Enums.SubscriptionPlan | null
    subscriptionEnd: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLogin: Date | null
    subscriptionPlan: $Enums.SubscriptionPlan | null
    subscriptionEnd: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    firstName: number
    lastName: number
    phone: number
    isActive: number
    createdAt: number
    updatedAt: number
    lastLogin: number
    subscriptionPlan: number
    subscriptionEnd: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastLogin?: true
    subscriptionPlan?: true
    subscriptionEnd?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastLogin?: true
    subscriptionPlan?: true
    subscriptionEnd?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    lastLogin?: true
    subscriptionPlan?: true
    subscriptionEnd?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    lastLogin: Date | null
    subscriptionPlan: $Enums.SubscriptionPlan
    subscriptionEnd: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLogin?: boolean
    subscriptionPlan?: boolean
    subscriptionEnd?: boolean
    businesses?: boolean | User$businessesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLogin?: boolean
    subscriptionPlan?: boolean
    subscriptionEnd?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLogin?: boolean
    subscriptionPlan?: boolean
    subscriptionEnd?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    businesses?: boolean | User$businessesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      businesses: Prisma.$BusinessPayload<ExtArgs>[]
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      firstName: string
      lastName: string
      phone: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      lastLogin: Date | null
      subscriptionPlan: $Enums.SubscriptionPlan
      subscriptionEnd: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    businesses<T extends User$businessesArgs<ExtArgs> = {}>(args?: Subset<T, User$businessesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly subscriptionPlan: FieldRef<"User", 'SubscriptionPlan'>
    readonly subscriptionEnd: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.businesses
   */
  export type User$businessesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    cursor?: BusinessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    token: string
    expiresAt: Date
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
  }

  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      expiresAt: Date
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */ 
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly token: FieldRef<"UserSession", 'String'>
    readonly expiresAt: FieldRef<"UserSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model Business
   */

  export type AggregateBusiness = {
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  export type BusinessMinAggregateOutputType = {
    id: string | null
    userId: string | null
    companyName: string | null
    ntnNumber: string | null
    address: string | null
    province: string | null
    city: string | null
    postalCode: string | null
    businessType: string | null
    sector: string | null
    phoneNumber: string | null
    email: string | null
    website: string | null
    fbrSetupComplete: boolean | null
    fbrSetupSkipped: boolean | null
    integrationMode: $Enums.IntegrationMode | null
    sandboxValidated: boolean | null
    productionEnabled: boolean | null
    sandboxToken: string | null
    productionToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    companyName: string | null
    ntnNumber: string | null
    address: string | null
    province: string | null
    city: string | null
    postalCode: string | null
    businessType: string | null
    sector: string | null
    phoneNumber: string | null
    email: string | null
    website: string | null
    fbrSetupComplete: boolean | null
    fbrSetupSkipped: boolean | null
    integrationMode: $Enums.IntegrationMode | null
    sandboxValidated: boolean | null
    productionEnabled: boolean | null
    sandboxToken: string | null
    productionToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessCountAggregateOutputType = {
    id: number
    userId: number
    companyName: number
    ntnNumber: number
    address: number
    province: number
    city: number
    postalCode: number
    businessType: number
    sector: number
    phoneNumber: number
    email: number
    website: number
    fbrSetupComplete: number
    fbrSetupSkipped: number
    integrationMode: number
    sandboxValidated: number
    productionEnabled: number
    sandboxToken: number
    productionToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BusinessMinAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    ntnNumber?: true
    address?: true
    province?: true
    city?: true
    postalCode?: true
    businessType?: true
    sector?: true
    phoneNumber?: true
    email?: true
    website?: true
    fbrSetupComplete?: true
    fbrSetupSkipped?: true
    integrationMode?: true
    sandboxValidated?: true
    productionEnabled?: true
    sandboxToken?: true
    productionToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessMaxAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    ntnNumber?: true
    address?: true
    province?: true
    city?: true
    postalCode?: true
    businessType?: true
    sector?: true
    phoneNumber?: true
    email?: true
    website?: true
    fbrSetupComplete?: true
    fbrSetupSkipped?: true
    integrationMode?: true
    sandboxValidated?: true
    productionEnabled?: true
    sandboxToken?: true
    productionToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessCountAggregateInputType = {
    id?: true
    userId?: true
    companyName?: true
    ntnNumber?: true
    address?: true
    province?: true
    city?: true
    postalCode?: true
    businessType?: true
    sector?: true
    phoneNumber?: true
    email?: true
    website?: true
    fbrSetupComplete?: true
    fbrSetupSkipped?: true
    integrationMode?: true
    sandboxValidated?: true
    productionEnabled?: true
    sandboxToken?: true
    productionToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BusinessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Business to aggregate.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Businesses
    **/
    _count?: true | BusinessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessMaxAggregateInputType
  }

  export type GetBusinessAggregateType<T extends BusinessAggregateArgs> = {
        [P in keyof T & keyof AggregateBusiness]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusiness[P]>
      : GetScalarType<T[P], AggregateBusiness[P]>
  }




  export type BusinessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithAggregationInput | BusinessOrderByWithAggregationInput[]
    by: BusinessScalarFieldEnum[] | BusinessScalarFieldEnum
    having?: BusinessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessCountAggregateInputType | true
    _min?: BusinessMinAggregateInputType
    _max?: BusinessMaxAggregateInputType
  }

  export type BusinessGroupByOutputType = {
    id: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city: string | null
    postalCode: string | null
    businessType: string
    sector: string
    phoneNumber: string | null
    email: string | null
    website: string | null
    fbrSetupComplete: boolean
    fbrSetupSkipped: boolean
    integrationMode: $Enums.IntegrationMode
    sandboxValidated: boolean
    productionEnabled: boolean
    sandboxToken: string | null
    productionToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  type GetBusinessGroupByPayload<T extends BusinessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessGroupByOutputType[P]>
        }
      >
    >


  export type BusinessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    companyName?: boolean
    ntnNumber?: boolean
    address?: boolean
    province?: boolean
    city?: boolean
    postalCode?: boolean
    businessType?: boolean
    sector?: boolean
    phoneNumber?: boolean
    email?: boolean
    website?: boolean
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: boolean
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: boolean
    productionToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    invoices?: boolean | Business$invoicesArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    products?: boolean | Business$productsArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    companyName?: boolean
    ntnNumber?: boolean
    address?: boolean
    province?: boolean
    city?: boolean
    postalCode?: boolean
    businessType?: boolean
    sector?: boolean
    phoneNumber?: boolean
    email?: boolean
    website?: boolean
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: boolean
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: boolean
    productionToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectScalar = {
    id?: boolean
    userId?: boolean
    companyName?: boolean
    ntnNumber?: boolean
    address?: boolean
    province?: boolean
    city?: boolean
    postalCode?: boolean
    businessType?: boolean
    sector?: boolean
    phoneNumber?: boolean
    email?: boolean
    website?: boolean
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: boolean
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: boolean
    productionToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BusinessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    invoices?: boolean | Business$invoicesArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    products?: boolean | Business$productsArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BusinessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BusinessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Business"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      customers: Prisma.$CustomerPayload<ExtArgs>[]
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      companyName: string
      ntnNumber: string
      address: string
      province: string
      city: string | null
      postalCode: string | null
      businessType: string
      sector: string
      phoneNumber: string | null
      email: string | null
      website: string | null
      fbrSetupComplete: boolean
      fbrSetupSkipped: boolean
      integrationMode: $Enums.IntegrationMode
      sandboxValidated: boolean
      productionEnabled: boolean
      sandboxToken: string | null
      productionToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["business"]>
    composites: {}
  }

  type BusinessGetPayload<S extends boolean | null | undefined | BusinessDefaultArgs> = $Result.GetResult<Prisma.$BusinessPayload, S>

  type BusinessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BusinessFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BusinessCountAggregateInputType | true
    }

  export interface BusinessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Business'], meta: { name: 'Business' } }
    /**
     * Find zero or one Business that matches the filter.
     * @param {BusinessFindUniqueArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessFindUniqueArgs>(args: SelectSubset<T, BusinessFindUniqueArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Business that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BusinessFindUniqueOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Business that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessFindFirstArgs>(args?: SelectSubset<T, BusinessFindFirstArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Business that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Businesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Businesses
     * const businesses = await prisma.business.findMany()
     * 
     * // Get first 10 Businesses
     * const businesses = await prisma.business.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessWithIdOnly = await prisma.business.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessFindManyArgs>(args?: SelectSubset<T, BusinessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Business.
     * @param {BusinessCreateArgs} args - Arguments to create a Business.
     * @example
     * // Create one Business
     * const Business = await prisma.business.create({
     *   data: {
     *     // ... data to create a Business
     *   }
     * })
     * 
     */
    create<T extends BusinessCreateArgs>(args: SelectSubset<T, BusinessCreateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Businesses.
     * @param {BusinessCreateManyArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessCreateManyArgs>(args?: SelectSubset<T, BusinessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Businesses and returns the data saved in the database.
     * @param {BusinessCreateManyAndReturnArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Businesses and only return the `id`
     * const businessWithIdOnly = await prisma.business.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BusinessCreateManyAndReturnArgs>(args?: SelectSubset<T, BusinessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Business.
     * @param {BusinessDeleteArgs} args - Arguments to delete one Business.
     * @example
     * // Delete one Business
     * const Business = await prisma.business.delete({
     *   where: {
     *     // ... filter to delete one Business
     *   }
     * })
     * 
     */
    delete<T extends BusinessDeleteArgs>(args: SelectSubset<T, BusinessDeleteArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Business.
     * @param {BusinessUpdateArgs} args - Arguments to update one Business.
     * @example
     * // Update one Business
     * const business = await prisma.business.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessUpdateArgs>(args: SelectSubset<T, BusinessUpdateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Businesses.
     * @param {BusinessDeleteManyArgs} args - Arguments to filter Businesses to delete.
     * @example
     * // Delete a few Businesses
     * const { count } = await prisma.business.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessDeleteManyArgs>(args?: SelectSubset<T, BusinessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessUpdateManyArgs>(args: SelectSubset<T, BusinessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Business.
     * @param {BusinessUpsertArgs} args - Arguments to update or create a Business.
     * @example
     * // Update or create a Business
     * const business = await prisma.business.upsert({
     *   create: {
     *     // ... data to create a Business
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Business we want to update
     *   }
     * })
     */
    upsert<T extends BusinessUpsertArgs>(args: SelectSubset<T, BusinessUpsertArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessCountArgs} args - Arguments to filter Businesses to count.
     * @example
     * // Count the number of Businesses
     * const count = await prisma.business.count({
     *   where: {
     *     // ... the filter for the Businesses we want to count
     *   }
     * })
    **/
    count<T extends BusinessCountArgs>(
      args?: Subset<T, BusinessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BusinessAggregateArgs>(args: Subset<T, BusinessAggregateArgs>): Prisma.PrismaPromise<GetBusinessAggregateType<T>>

    /**
     * Group by Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BusinessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessGroupByArgs['orderBy'] }
        : { orderBy?: BusinessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BusinessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Business model
   */
  readonly fields: BusinessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Business.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    invoices<T extends Business$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Business$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany"> | Null>
    customers<T extends Business$customersArgs<ExtArgs> = {}>(args?: Subset<T, Business$customersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany"> | Null>
    products<T extends Business$productsArgs<ExtArgs> = {}>(args?: Subset<T, Business$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Business model
   */ 
  interface BusinessFieldRefs {
    readonly id: FieldRef<"Business", 'String'>
    readonly userId: FieldRef<"Business", 'String'>
    readonly companyName: FieldRef<"Business", 'String'>
    readonly ntnNumber: FieldRef<"Business", 'String'>
    readonly address: FieldRef<"Business", 'String'>
    readonly province: FieldRef<"Business", 'String'>
    readonly city: FieldRef<"Business", 'String'>
    readonly postalCode: FieldRef<"Business", 'String'>
    readonly businessType: FieldRef<"Business", 'String'>
    readonly sector: FieldRef<"Business", 'String'>
    readonly phoneNumber: FieldRef<"Business", 'String'>
    readonly email: FieldRef<"Business", 'String'>
    readonly website: FieldRef<"Business", 'String'>
    readonly fbrSetupComplete: FieldRef<"Business", 'Boolean'>
    readonly fbrSetupSkipped: FieldRef<"Business", 'Boolean'>
    readonly integrationMode: FieldRef<"Business", 'IntegrationMode'>
    readonly sandboxValidated: FieldRef<"Business", 'Boolean'>
    readonly productionEnabled: FieldRef<"Business", 'Boolean'>
    readonly sandboxToken: FieldRef<"Business", 'String'>
    readonly productionToken: FieldRef<"Business", 'String'>
    readonly createdAt: FieldRef<"Business", 'DateTime'>
    readonly updatedAt: FieldRef<"Business", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Business findUnique
   */
  export type BusinessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findUniqueOrThrow
   */
  export type BusinessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findFirst
   */
  export type BusinessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findFirstOrThrow
   */
  export type BusinessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findMany
   */
  export type BusinessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Businesses to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business create
   */
  export type BusinessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to create a Business.
     */
    data: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
  }

  /**
   * Business createMany
   */
  export type BusinessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Business createManyAndReturn
   */
  export type BusinessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Business update
   */
  export type BusinessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to update a Business.
     */
    data: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
    /**
     * Choose, which Business to update.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business updateMany
   */
  export type BusinessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Businesses.
     */
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyInput>
    /**
     * Filter which Businesses to update
     */
    where?: BusinessWhereInput
  }

  /**
   * Business upsert
   */
  export type BusinessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The filter to search for the Business to update in case it exists.
     */
    where: BusinessWhereUniqueInput
    /**
     * In case the Business found by the `where` argument doesn't exist, create a new Business with this data.
     */
    create: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
    /**
     * In case the Business was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
  }

  /**
   * Business delete
   */
  export type BusinessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter which Business to delete.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business deleteMany
   */
  export type BusinessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Businesses to delete
     */
    where?: BusinessWhereInput
  }

  /**
   * Business.invoices
   */
  export type Business$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Business.customers
   */
  export type Business$customersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Business.products
   */
  export type Business$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Business without action
   */
  export type BusinessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    province: string | null
    postalCode: string | null
    ntnNumber: string | null
    registrationType: $Enums.RegistrationType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    province: string | null
    postalCode: string | null
    ntnNumber: string | null
    registrationType: $Enums.RegistrationType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    businessId: number
    name: number
    email: number
    phone: number
    address: number
    city: number
    province: number
    postalCode: number
    ntnNumber: number
    registrationType: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    province?: true
    postalCode?: true
    ntnNumber?: true
    registrationType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    province?: true
    postalCode?: true
    ntnNumber?: true
    registrationType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    province?: true
    postalCode?: true
    ntnNumber?: true
    registrationType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    businessId: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    province: string | null
    postalCode: string | null
    ntnNumber: string | null
    registrationType: $Enums.RegistrationType
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    province?: boolean
    postalCode?: boolean
    ntnNumber?: boolean
    registrationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    invoices?: boolean | Customer$invoicesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    province?: boolean
    postalCode?: boolean
    ntnNumber?: boolean
    registrationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    businessId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    province?: boolean
    postalCode?: boolean
    ntnNumber?: boolean
    registrationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    invoices?: boolean | Customer$invoicesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      name: string
      email: string | null
      phone: string | null
      address: string | null
      city: string | null
      province: string | null
      postalCode: string | null
      ntnNumber: string | null
      registrationType: $Enums.RegistrationType
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    invoices<T extends Customer$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly businessId: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly city: FieldRef<"Customer", 'String'>
    readonly province: FieldRef<"Customer", 'String'>
    readonly postalCode: FieldRef<"Customer", 'String'>
    readonly ntnNumber: FieldRef<"Customer", 'String'>
    readonly registrationType: FieldRef<"Customer", 'RegistrationType'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.invoices
   */
  export type Customer$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    invoiceSequence: number | null
    subtotal: number | null
    taxAmount: number | null
    totalAmount: number | null
    discount: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    invoiceSequence: number | null
    subtotal: number | null
    taxAmount: number | null
    totalAmount: number | null
    discount: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerId: string | null
    localInvoiceNumber: string | null
    invoiceSequence: number | null
    invoiceDate: string | null
    dueDate: string | null
    description: string | null
    notes: string | null
    subtotal: number | null
    taxAmount: number | null
    totalAmount: number | null
    discount: number | null
    status: $Enums.InvoiceStatus | null
    mode: $Enums.IntegrationMode | null
    fbrSubmitted: boolean | null
    fbrValidated: boolean | null
    submissionTimestamp: Date | null
    fbrInvoiceNumber: string | null
    locallyGeneratedQRCode: string | null
    fbrTimestamp: string | null
    fbrTransmissionId: string | null
    fbrAcknowledgmentNumber: string | null
    pdfGenerated: boolean | null
    pdfStoragePath: string | null
    encryptedData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerId: string | null
    localInvoiceNumber: string | null
    invoiceSequence: number | null
    invoiceDate: string | null
    dueDate: string | null
    description: string | null
    notes: string | null
    subtotal: number | null
    taxAmount: number | null
    totalAmount: number | null
    discount: number | null
    status: $Enums.InvoiceStatus | null
    mode: $Enums.IntegrationMode | null
    fbrSubmitted: boolean | null
    fbrValidated: boolean | null
    submissionTimestamp: Date | null
    fbrInvoiceNumber: string | null
    locallyGeneratedQRCode: string | null
    fbrTimestamp: string | null
    fbrTransmissionId: string | null
    fbrAcknowledgmentNumber: string | null
    pdfGenerated: boolean | null
    pdfStoragePath: string | null
    encryptedData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    businessId: number
    customerId: number
    localInvoiceNumber: number
    invoiceSequence: number
    invoiceDate: number
    dueDate: number
    description: number
    notes: number
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount: number
    status: number
    mode: number
    fbrSubmitted: number
    fbrValidated: number
    submissionTimestamp: number
    fbrInvoiceNumber: number
    locallyGeneratedQRCode: number
    fbrTimestamp: number
    fbrTransmissionId: number
    fbrAcknowledgmentNumber: number
    fbrResponse: number
    pdfGenerated: number
    pdfStoragePath: number
    encryptedData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    invoiceSequence?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    discount?: true
  }

  export type InvoiceSumAggregateInputType = {
    invoiceSequence?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    discount?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    localInvoiceNumber?: true
    invoiceSequence?: true
    invoiceDate?: true
    dueDate?: true
    description?: true
    notes?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    discount?: true
    status?: true
    mode?: true
    fbrSubmitted?: true
    fbrValidated?: true
    submissionTimestamp?: true
    fbrInvoiceNumber?: true
    locallyGeneratedQRCode?: true
    fbrTimestamp?: true
    fbrTransmissionId?: true
    fbrAcknowledgmentNumber?: true
    pdfGenerated?: true
    pdfStoragePath?: true
    encryptedData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    localInvoiceNumber?: true
    invoiceSequence?: true
    invoiceDate?: true
    dueDate?: true
    description?: true
    notes?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    discount?: true
    status?: true
    mode?: true
    fbrSubmitted?: true
    fbrValidated?: true
    submissionTimestamp?: true
    fbrInvoiceNumber?: true
    locallyGeneratedQRCode?: true
    fbrTimestamp?: true
    fbrTransmissionId?: true
    fbrAcknowledgmentNumber?: true
    pdfGenerated?: true
    pdfStoragePath?: true
    encryptedData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    localInvoiceNumber?: true
    invoiceSequence?: true
    invoiceDate?: true
    dueDate?: true
    description?: true
    notes?: true
    subtotal?: true
    taxAmount?: true
    totalAmount?: true
    discount?: true
    status?: true
    mode?: true
    fbrSubmitted?: true
    fbrValidated?: true
    submissionTimestamp?: true
    fbrInvoiceNumber?: true
    locallyGeneratedQRCode?: true
    fbrTimestamp?: true
    fbrTransmissionId?: true
    fbrAcknowledgmentNumber?: true
    fbrResponse?: true
    pdfGenerated?: true
    pdfStoragePath?: true
    encryptedData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    businessId: string
    customerId: string | null
    localInvoiceNumber: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate: string | null
    description: string | null
    notes: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount: number
    status: $Enums.InvoiceStatus
    mode: $Enums.IntegrationMode
    fbrSubmitted: boolean
    fbrValidated: boolean
    submissionTimestamp: Date | null
    fbrInvoiceNumber: string | null
    locallyGeneratedQRCode: string | null
    fbrTimestamp: string | null
    fbrTransmissionId: string | null
    fbrAcknowledgmentNumber: string | null
    fbrResponse: JsonValue | null
    pdfGenerated: boolean
    pdfStoragePath: string | null
    encryptedData: string | null
    createdAt: Date
    updatedAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    localInvoiceNumber?: boolean
    invoiceSequence?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    description?: boolean
    notes?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    discount?: boolean
    status?: boolean
    mode?: boolean
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: boolean
    fbrInvoiceNumber?: boolean
    locallyGeneratedQRCode?: boolean
    fbrTimestamp?: boolean
    fbrTransmissionId?: boolean
    fbrAcknowledgmentNumber?: boolean
    fbrResponse?: boolean
    pdfGenerated?: boolean
    pdfStoragePath?: boolean
    encryptedData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | Invoice$customerArgs<ExtArgs>
    items?: boolean | Invoice$itemsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    localInvoiceNumber?: boolean
    invoiceSequence?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    description?: boolean
    notes?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    discount?: boolean
    status?: boolean
    mode?: boolean
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: boolean
    fbrInvoiceNumber?: boolean
    locallyGeneratedQRCode?: boolean
    fbrTimestamp?: boolean
    fbrTransmissionId?: boolean
    fbrAcknowledgmentNumber?: boolean
    fbrResponse?: boolean
    pdfGenerated?: boolean
    pdfStoragePath?: boolean
    encryptedData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | Invoice$customerArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    localInvoiceNumber?: boolean
    invoiceSequence?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    description?: boolean
    notes?: boolean
    subtotal?: boolean
    taxAmount?: boolean
    totalAmount?: boolean
    discount?: boolean
    status?: boolean
    mode?: boolean
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: boolean
    fbrInvoiceNumber?: boolean
    locallyGeneratedQRCode?: boolean
    fbrTimestamp?: boolean
    fbrTransmissionId?: boolean
    fbrAcknowledgmentNumber?: boolean
    fbrResponse?: boolean
    pdfGenerated?: boolean
    pdfStoragePath?: boolean
    encryptedData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | Invoice$customerArgs<ExtArgs>
    items?: boolean | Invoice$itemsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | Invoice$customerArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      items: Prisma.$InvoiceItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      customerId: string | null
      localInvoiceNumber: string | null
      invoiceSequence: number
      invoiceDate: string
      dueDate: string | null
      description: string | null
      notes: string | null
      subtotal: number
      taxAmount: number
      totalAmount: number
      discount: number
      status: $Enums.InvoiceStatus
      mode: $Enums.IntegrationMode
      fbrSubmitted: boolean
      fbrValidated: boolean
      submissionTimestamp: Date | null
      fbrInvoiceNumber: string | null
      locallyGeneratedQRCode: string | null
      fbrTimestamp: string | null
      fbrTransmissionId: string | null
      fbrAcknowledgmentNumber: string | null
      fbrResponse: Prisma.JsonValue | null
      pdfGenerated: boolean
      pdfStoragePath: string | null
      encryptedData: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    customer<T extends Invoice$customerArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    items<T extends Invoice$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */ 
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly businessId: FieldRef<"Invoice", 'String'>
    readonly customerId: FieldRef<"Invoice", 'String'>
    readonly localInvoiceNumber: FieldRef<"Invoice", 'String'>
    readonly invoiceSequence: FieldRef<"Invoice", 'Int'>
    readonly invoiceDate: FieldRef<"Invoice", 'String'>
    readonly dueDate: FieldRef<"Invoice", 'String'>
    readonly description: FieldRef<"Invoice", 'String'>
    readonly notes: FieldRef<"Invoice", 'String'>
    readonly subtotal: FieldRef<"Invoice", 'Float'>
    readonly taxAmount: FieldRef<"Invoice", 'Float'>
    readonly totalAmount: FieldRef<"Invoice", 'Float'>
    readonly discount: FieldRef<"Invoice", 'Float'>
    readonly status: FieldRef<"Invoice", 'InvoiceStatus'>
    readonly mode: FieldRef<"Invoice", 'IntegrationMode'>
    readonly fbrSubmitted: FieldRef<"Invoice", 'Boolean'>
    readonly fbrValidated: FieldRef<"Invoice", 'Boolean'>
    readonly submissionTimestamp: FieldRef<"Invoice", 'DateTime'>
    readonly fbrInvoiceNumber: FieldRef<"Invoice", 'String'>
    readonly locallyGeneratedQRCode: FieldRef<"Invoice", 'String'>
    readonly fbrTimestamp: FieldRef<"Invoice", 'String'>
    readonly fbrTransmissionId: FieldRef<"Invoice", 'String'>
    readonly fbrAcknowledgmentNumber: FieldRef<"Invoice", 'String'>
    readonly fbrResponse: FieldRef<"Invoice", 'Json'>
    readonly pdfGenerated: FieldRef<"Invoice", 'Boolean'>
    readonly pdfStoragePath: FieldRef<"Invoice", 'String'>
    readonly encryptedData: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice.customer
   */
  export type Invoice$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Invoice.items
   */
  export type Invoice$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    cursor?: InvoiceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceItem
   */

  export type AggregateInvoiceItem = {
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  export type InvoiceItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    totalValue: number | null
    taxRate: number | null
    taxAmount: number | null
  }

  export type InvoiceItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    totalValue: number | null
    taxRate: number | null
    taxAmount: number | null
  }

  export type InvoiceItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    hsCode: string | null
    quantity: number | null
    unitPrice: number | null
    totalValue: number | null
    taxRate: number | null
    taxAmount: number | null
    exemptionSRO: string | null
    unitOfMeasurement: string | null
  }

  export type InvoiceItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    hsCode: string | null
    quantity: number | null
    unitPrice: number | null
    totalValue: number | null
    taxRate: number | null
    taxAmount: number | null
    exemptionSRO: string | null
    unitOfMeasurement: string | null
  }

  export type InvoiceItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    description: number
    hsCode: number
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO: number
    unitOfMeasurement: number
    _all: number
  }


  export type InvoiceItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalValue?: true
    taxRate?: true
    taxAmount?: true
  }

  export type InvoiceItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalValue?: true
    taxRate?: true
    taxAmount?: true
  }

  export type InvoiceItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    hsCode?: true
    quantity?: true
    unitPrice?: true
    totalValue?: true
    taxRate?: true
    taxAmount?: true
    exemptionSRO?: true
    unitOfMeasurement?: true
  }

  export type InvoiceItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    hsCode?: true
    quantity?: true
    unitPrice?: true
    totalValue?: true
    taxRate?: true
    taxAmount?: true
    exemptionSRO?: true
    unitOfMeasurement?: true
  }

  export type InvoiceItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    hsCode?: true
    quantity?: true
    unitPrice?: true
    totalValue?: true
    taxRate?: true
    taxAmount?: true
    exemptionSRO?: true
    unitOfMeasurement?: true
    _all?: true
  }

  export type InvoiceItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItem to aggregate.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceItems
    **/
    _count?: true | InvoiceItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type GetInvoiceItemAggregateType<T extends InvoiceItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceItem[P]>
      : GetScalarType<T[P], AggregateInvoiceItem[P]>
  }




  export type InvoiceItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithAggregationInput | InvoiceItemOrderByWithAggregationInput[]
    by: InvoiceItemScalarFieldEnum[] | InvoiceItemScalarFieldEnum
    having?: InvoiceItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceItemCountAggregateInputType | true
    _avg?: InvoiceItemAvgAggregateInputType
    _sum?: InvoiceItemSumAggregateInputType
    _min?: InvoiceItemMinAggregateInputType
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type InvoiceItemGroupByOutputType = {
    id: string
    invoiceId: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO: string | null
    unitOfMeasurement: string
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  type GetInvoiceItemGroupByPayload<T extends InvoiceItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    hsCode?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalValue?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    exemptionSRO?: boolean
    unitOfMeasurement?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>

  export type InvoiceItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    hsCode?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalValue?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    exemptionSRO?: boolean
    unitOfMeasurement?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>

  export type InvoiceItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    hsCode?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalValue?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    exemptionSRO?: boolean
    unitOfMeasurement?: boolean
  }

  export type InvoiceItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type InvoiceItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $InvoiceItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceItem"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      description: string
      hsCode: string
      quantity: number
      unitPrice: number
      totalValue: number
      taxRate: number
      taxAmount: number
      exemptionSRO: string | null
      unitOfMeasurement: string
    }, ExtArgs["result"]["invoiceItem"]>
    composites: {}
  }

  type InvoiceItemGetPayload<S extends boolean | null | undefined | InvoiceItemDefaultArgs> = $Result.GetResult<Prisma.$InvoiceItemPayload, S>

  type InvoiceItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceItemCountAggregateInputType | true
    }

  export interface InvoiceItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceItem'], meta: { name: 'InvoiceItem' } }
    /**
     * Find zero or one InvoiceItem that matches the filter.
     * @param {InvoiceItemFindUniqueArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceItemFindUniqueArgs>(args: SelectSubset<T, InvoiceItemFindUniqueArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvoiceItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceItemFindUniqueOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvoiceItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceItemFindFirstArgs>(args?: SelectSubset<T, InvoiceItemFindFirstArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvoiceItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvoiceItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany()
     * 
     * // Get first 10 InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceItemFindManyArgs>(args?: SelectSubset<T, InvoiceItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvoiceItem.
     * @param {InvoiceItemCreateArgs} args - Arguments to create a InvoiceItem.
     * @example
     * // Create one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.create({
     *   data: {
     *     // ... data to create a InvoiceItem
     *   }
     * })
     * 
     */
    create<T extends InvoiceItemCreateArgs>(args: SelectSubset<T, InvoiceItemCreateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvoiceItems.
     * @param {InvoiceItemCreateManyArgs} args - Arguments to create many InvoiceItems.
     * @example
     * // Create many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceItemCreateManyArgs>(args?: SelectSubset<T, InvoiceItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceItems and returns the data saved in the database.
     * @param {InvoiceItemCreateManyAndReturnArgs} args - Arguments to create many InvoiceItems.
     * @example
     * // Create many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceItems and only return the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceItemCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvoiceItem.
     * @param {InvoiceItemDeleteArgs} args - Arguments to delete one InvoiceItem.
     * @example
     * // Delete one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.delete({
     *   where: {
     *     // ... filter to delete one InvoiceItem
     *   }
     * })
     * 
     */
    delete<T extends InvoiceItemDeleteArgs>(args: SelectSubset<T, InvoiceItemDeleteArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvoiceItem.
     * @param {InvoiceItemUpdateArgs} args - Arguments to update one InvoiceItem.
     * @example
     * // Update one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceItemUpdateArgs>(args: SelectSubset<T, InvoiceItemUpdateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvoiceItems.
     * @param {InvoiceItemDeleteManyArgs} args - Arguments to filter InvoiceItems to delete.
     * @example
     * // Delete a few InvoiceItems
     * const { count } = await prisma.invoiceItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceItemDeleteManyArgs>(args?: SelectSubset<T, InvoiceItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceItemUpdateManyArgs>(args: SelectSubset<T, InvoiceItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceItem.
     * @param {InvoiceItemUpsertArgs} args - Arguments to update or create a InvoiceItem.
     * @example
     * // Update or create a InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.upsert({
     *   create: {
     *     // ... data to create a InvoiceItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceItem we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceItemUpsertArgs>(args: SelectSubset<T, InvoiceItemUpsertArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemCountArgs} args - Arguments to filter InvoiceItems to count.
     * @example
     * // Count the number of InvoiceItems
     * const count = await prisma.invoiceItem.count({
     *   where: {
     *     // ... the filter for the InvoiceItems we want to count
     *   }
     * })
    **/
    count<T extends InvoiceItemCountArgs>(
      args?: Subset<T, InvoiceItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceItemAggregateArgs>(args: Subset<T, InvoiceItemAggregateArgs>): Prisma.PrismaPromise<GetInvoiceItemAggregateType<T>>

    /**
     * Group by InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceItemGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceItem model
   */
  readonly fields: InvoiceItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceItem model
   */ 
  interface InvoiceItemFieldRefs {
    readonly id: FieldRef<"InvoiceItem", 'String'>
    readonly invoiceId: FieldRef<"InvoiceItem", 'String'>
    readonly description: FieldRef<"InvoiceItem", 'String'>
    readonly hsCode: FieldRef<"InvoiceItem", 'String'>
    readonly quantity: FieldRef<"InvoiceItem", 'Float'>
    readonly unitPrice: FieldRef<"InvoiceItem", 'Float'>
    readonly totalValue: FieldRef<"InvoiceItem", 'Float'>
    readonly taxRate: FieldRef<"InvoiceItem", 'Float'>
    readonly taxAmount: FieldRef<"InvoiceItem", 'Float'>
    readonly exemptionSRO: FieldRef<"InvoiceItem", 'String'>
    readonly unitOfMeasurement: FieldRef<"InvoiceItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceItem findUnique
   */
  export type InvoiceItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findUniqueOrThrow
   */
  export type InvoiceItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findFirst
   */
  export type InvoiceItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findFirstOrThrow
   */
  export type InvoiceItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findMany
   */
  export type InvoiceItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItems to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem create
   */
  export type InvoiceItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceItem.
     */
    data: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
  }

  /**
   * InvoiceItem createMany
   */
  export type InvoiceItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceItems.
     */
    data: InvoiceItemCreateManyInput | InvoiceItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvoiceItem createManyAndReturn
   */
  export type InvoiceItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvoiceItems.
     */
    data: InvoiceItemCreateManyInput | InvoiceItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceItem update
   */
  export type InvoiceItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceItem.
     */
    data: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
    /**
     * Choose, which InvoiceItem to update.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem updateMany
   */
  export type InvoiceItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceItems.
     */
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceItems to update
     */
    where?: InvoiceItemWhereInput
  }

  /**
   * InvoiceItem upsert
   */
  export type InvoiceItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceItem to update in case it exists.
     */
    where: InvoiceItemWhereUniqueInput
    /**
     * In case the InvoiceItem found by the `where` argument doesn't exist, create a new InvoiceItem with this data.
     */
    create: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
    /**
     * In case the InvoiceItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
  }

  /**
   * InvoiceItem delete
   */
  export type InvoiceItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter which InvoiceItem to delete.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem deleteMany
   */
  export type InvoiceItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItems to delete
     */
    where?: InvoiceItemWhereInput
  }

  /**
   * InvoiceItem without action
   */
  export type InvoiceItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    unitPrice: Decimal | null
    taxRate: number | null
    stock: number | null
  }

  export type ProductSumAggregateOutputType = {
    unitPrice: Decimal | null
    taxRate: number | null
    stock: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    description: string | null
    hsCode: string | null
    unitOfMeasurement: string | null
    unitPrice: Decimal | null
    taxRate: number | null
    category: string | null
    sku: string | null
    stock: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    description: string | null
    hsCode: string | null
    unitOfMeasurement: string | null
    unitPrice: Decimal | null
    taxRate: number | null
    category: string | null
    sku: string | null
    stock: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    businessId: number
    name: number
    description: number
    hsCode: number
    unitOfMeasurement: number
    unitPrice: number
    taxRate: number
    category: number
    sku: number
    stock: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    unitPrice?: true
    taxRate?: true
    stock?: true
  }

  export type ProductSumAggregateInputType = {
    unitPrice?: true
    taxRate?: true
    stock?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    description?: true
    hsCode?: true
    unitOfMeasurement?: true
    unitPrice?: true
    taxRate?: true
    category?: true
    sku?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    description?: true
    hsCode?: true
    unitOfMeasurement?: true
    unitPrice?: true
    taxRate?: true
    category?: true
    sku?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    description?: true
    hsCode?: true
    unitOfMeasurement?: true
    unitPrice?: true
    taxRate?: true
    category?: true
    sku?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    businessId: string
    name: string
    description: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal
    taxRate: number
    category: string | null
    sku: string | null
    stock: number | null
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    description?: boolean
    hsCode?: boolean
    unitOfMeasurement?: boolean
    unitPrice?: boolean
    taxRate?: boolean
    category?: boolean
    sku?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    description?: boolean
    hsCode?: boolean
    unitOfMeasurement?: boolean
    unitPrice?: boolean
    taxRate?: boolean
    category?: boolean
    sku?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    businessId?: boolean
    name?: boolean
    description?: boolean
    hsCode?: boolean
    unitOfMeasurement?: boolean
    unitPrice?: boolean
    taxRate?: boolean
    category?: boolean
    sku?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      name: string
      description: string | null
      hsCode: string
      unitOfMeasurement: string
      unitPrice: Prisma.Decimal
      taxRate: number
      category: string | null
      sku: string | null
      stock: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly businessId: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly hsCode: FieldRef<"Product", 'String'>
    readonly unitOfMeasurement: FieldRef<"Product", 'String'>
    readonly unitPrice: FieldRef<"Product", 'Decimal'>
    readonly taxRate: FieldRef<"Product", 'Int'>
    readonly category: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly stock: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model BulkInvoiceBatch
   */

  export type AggregateBulkInvoiceBatch = {
    _count: BulkInvoiceBatchCountAggregateOutputType | null
    _avg: BulkInvoiceBatchAvgAggregateOutputType | null
    _sum: BulkInvoiceBatchSumAggregateOutputType | null
    _min: BulkInvoiceBatchMinAggregateOutputType | null
    _max: BulkInvoiceBatchMaxAggregateOutputType | null
  }

  export type BulkInvoiceBatchAvgAggregateOutputType = {
    fileSize: number | null
    totalRecords: number | null
    validRecords: number | null
    invalidRecords: number | null
  }

  export type BulkInvoiceBatchSumAggregateOutputType = {
    fileSize: number | null
    totalRecords: number | null
    validRecords: number | null
    invalidRecords: number | null
  }

  export type BulkInvoiceBatchMinAggregateOutputType = {
    id: string | null
    userId: string | null
    businessId: string | null
    fileName: string | null
    originalName: string | null
    fileSize: number | null
    totalRecords: number | null
    validRecords: number | null
    invalidRecords: number | null
    processingStatus: $Enums.ProcessingStatus | null
    validationStatus: $Enums.ValidationStatus | null
    uploadedAt: Date | null
    processedAt: Date | null
    completedAt: Date | null
  }

  export type BulkInvoiceBatchMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    businessId: string | null
    fileName: string | null
    originalName: string | null
    fileSize: number | null
    totalRecords: number | null
    validRecords: number | null
    invalidRecords: number | null
    processingStatus: $Enums.ProcessingStatus | null
    validationStatus: $Enums.ValidationStatus | null
    uploadedAt: Date | null
    processedAt: Date | null
    completedAt: Date | null
  }

  export type BulkInvoiceBatchCountAggregateOutputType = {
    id: number
    userId: number
    businessId: number
    fileName: number
    originalName: number
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus: number
    validationStatus: number
    validationErrors: number
    processingErrors: number
    uploadedAt: number
    processedAt: number
    completedAt: number
    _all: number
  }


  export type BulkInvoiceBatchAvgAggregateInputType = {
    fileSize?: true
    totalRecords?: true
    validRecords?: true
    invalidRecords?: true
  }

  export type BulkInvoiceBatchSumAggregateInputType = {
    fileSize?: true
    totalRecords?: true
    validRecords?: true
    invalidRecords?: true
  }

  export type BulkInvoiceBatchMinAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    totalRecords?: true
    validRecords?: true
    invalidRecords?: true
    processingStatus?: true
    validationStatus?: true
    uploadedAt?: true
    processedAt?: true
    completedAt?: true
  }

  export type BulkInvoiceBatchMaxAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    totalRecords?: true
    validRecords?: true
    invalidRecords?: true
    processingStatus?: true
    validationStatus?: true
    uploadedAt?: true
    processedAt?: true
    completedAt?: true
  }

  export type BulkInvoiceBatchCountAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    fileName?: true
    originalName?: true
    fileSize?: true
    totalRecords?: true
    validRecords?: true
    invalidRecords?: true
    processingStatus?: true
    validationStatus?: true
    validationErrors?: true
    processingErrors?: true
    uploadedAt?: true
    processedAt?: true
    completedAt?: true
    _all?: true
  }

  export type BulkInvoiceBatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkInvoiceBatch to aggregate.
     */
    where?: BulkInvoiceBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceBatches to fetch.
     */
    orderBy?: BulkInvoiceBatchOrderByWithRelationInput | BulkInvoiceBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BulkInvoiceBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BulkInvoiceBatches
    **/
    _count?: true | BulkInvoiceBatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BulkInvoiceBatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BulkInvoiceBatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BulkInvoiceBatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BulkInvoiceBatchMaxAggregateInputType
  }

  export type GetBulkInvoiceBatchAggregateType<T extends BulkInvoiceBatchAggregateArgs> = {
        [P in keyof T & keyof AggregateBulkInvoiceBatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBulkInvoiceBatch[P]>
      : GetScalarType<T[P], AggregateBulkInvoiceBatch[P]>
  }




  export type BulkInvoiceBatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BulkInvoiceBatchWhereInput
    orderBy?: BulkInvoiceBatchOrderByWithAggregationInput | BulkInvoiceBatchOrderByWithAggregationInput[]
    by: BulkInvoiceBatchScalarFieldEnum[] | BulkInvoiceBatchScalarFieldEnum
    having?: BulkInvoiceBatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BulkInvoiceBatchCountAggregateInputType | true
    _avg?: BulkInvoiceBatchAvgAggregateInputType
    _sum?: BulkInvoiceBatchSumAggregateInputType
    _min?: BulkInvoiceBatchMinAggregateInputType
    _max?: BulkInvoiceBatchMaxAggregateInputType
  }

  export type BulkInvoiceBatchGroupByOutputType = {
    id: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus: $Enums.ProcessingStatus
    validationStatus: $Enums.ValidationStatus
    validationErrors: JsonValue | null
    processingErrors: JsonValue | null
    uploadedAt: Date
    processedAt: Date | null
    completedAt: Date | null
    _count: BulkInvoiceBatchCountAggregateOutputType | null
    _avg: BulkInvoiceBatchAvgAggregateOutputType | null
    _sum: BulkInvoiceBatchSumAggregateOutputType | null
    _min: BulkInvoiceBatchMinAggregateOutputType | null
    _max: BulkInvoiceBatchMaxAggregateOutputType | null
  }

  type GetBulkInvoiceBatchGroupByPayload<T extends BulkInvoiceBatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BulkInvoiceBatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BulkInvoiceBatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BulkInvoiceBatchGroupByOutputType[P]>
            : GetScalarType<T[P], BulkInvoiceBatchGroupByOutputType[P]>
        }
      >
    >


  export type BulkInvoiceBatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    businessId?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    totalRecords?: boolean
    validRecords?: boolean
    invalidRecords?: boolean
    processingStatus?: boolean
    validationStatus?: boolean
    validationErrors?: boolean
    processingErrors?: boolean
    uploadedAt?: boolean
    processedAt?: boolean
    completedAt?: boolean
    items?: boolean | BulkInvoiceBatch$itemsArgs<ExtArgs>
    _count?: boolean | BulkInvoiceBatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bulkInvoiceBatch"]>

  export type BulkInvoiceBatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    businessId?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    totalRecords?: boolean
    validRecords?: boolean
    invalidRecords?: boolean
    processingStatus?: boolean
    validationStatus?: boolean
    validationErrors?: boolean
    processingErrors?: boolean
    uploadedAt?: boolean
    processedAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["bulkInvoiceBatch"]>

  export type BulkInvoiceBatchSelectScalar = {
    id?: boolean
    userId?: boolean
    businessId?: boolean
    fileName?: boolean
    originalName?: boolean
    fileSize?: boolean
    totalRecords?: boolean
    validRecords?: boolean
    invalidRecords?: boolean
    processingStatus?: boolean
    validationStatus?: boolean
    validationErrors?: boolean
    processingErrors?: boolean
    uploadedAt?: boolean
    processedAt?: boolean
    completedAt?: boolean
  }

  export type BulkInvoiceBatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | BulkInvoiceBatch$itemsArgs<ExtArgs>
    _count?: boolean | BulkInvoiceBatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BulkInvoiceBatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BulkInvoiceBatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BulkInvoiceBatch"
    objects: {
      items: Prisma.$BulkInvoiceItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      businessId: string
      fileName: string
      originalName: string
      fileSize: number
      totalRecords: number
      validRecords: number
      invalidRecords: number
      processingStatus: $Enums.ProcessingStatus
      validationStatus: $Enums.ValidationStatus
      validationErrors: Prisma.JsonValue | null
      processingErrors: Prisma.JsonValue | null
      uploadedAt: Date
      processedAt: Date | null
      completedAt: Date | null
    }, ExtArgs["result"]["bulkInvoiceBatch"]>
    composites: {}
  }

  type BulkInvoiceBatchGetPayload<S extends boolean | null | undefined | BulkInvoiceBatchDefaultArgs> = $Result.GetResult<Prisma.$BulkInvoiceBatchPayload, S>

  type BulkInvoiceBatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BulkInvoiceBatchFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BulkInvoiceBatchCountAggregateInputType | true
    }

  export interface BulkInvoiceBatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BulkInvoiceBatch'], meta: { name: 'BulkInvoiceBatch' } }
    /**
     * Find zero or one BulkInvoiceBatch that matches the filter.
     * @param {BulkInvoiceBatchFindUniqueArgs} args - Arguments to find a BulkInvoiceBatch
     * @example
     * // Get one BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BulkInvoiceBatchFindUniqueArgs>(args: SelectSubset<T, BulkInvoiceBatchFindUniqueArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BulkInvoiceBatch that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BulkInvoiceBatchFindUniqueOrThrowArgs} args - Arguments to find a BulkInvoiceBatch
     * @example
     * // Get one BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BulkInvoiceBatchFindUniqueOrThrowArgs>(args: SelectSubset<T, BulkInvoiceBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BulkInvoiceBatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchFindFirstArgs} args - Arguments to find a BulkInvoiceBatch
     * @example
     * // Get one BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BulkInvoiceBatchFindFirstArgs>(args?: SelectSubset<T, BulkInvoiceBatchFindFirstArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BulkInvoiceBatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchFindFirstOrThrowArgs} args - Arguments to find a BulkInvoiceBatch
     * @example
     * // Get one BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BulkInvoiceBatchFindFirstOrThrowArgs>(args?: SelectSubset<T, BulkInvoiceBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BulkInvoiceBatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BulkInvoiceBatches
     * const bulkInvoiceBatches = await prisma.bulkInvoiceBatch.findMany()
     * 
     * // Get first 10 BulkInvoiceBatches
     * const bulkInvoiceBatches = await prisma.bulkInvoiceBatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bulkInvoiceBatchWithIdOnly = await prisma.bulkInvoiceBatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BulkInvoiceBatchFindManyArgs>(args?: SelectSubset<T, BulkInvoiceBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BulkInvoiceBatch.
     * @param {BulkInvoiceBatchCreateArgs} args - Arguments to create a BulkInvoiceBatch.
     * @example
     * // Create one BulkInvoiceBatch
     * const BulkInvoiceBatch = await prisma.bulkInvoiceBatch.create({
     *   data: {
     *     // ... data to create a BulkInvoiceBatch
     *   }
     * })
     * 
     */
    create<T extends BulkInvoiceBatchCreateArgs>(args: SelectSubset<T, BulkInvoiceBatchCreateArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BulkInvoiceBatches.
     * @param {BulkInvoiceBatchCreateManyArgs} args - Arguments to create many BulkInvoiceBatches.
     * @example
     * // Create many BulkInvoiceBatches
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BulkInvoiceBatchCreateManyArgs>(args?: SelectSubset<T, BulkInvoiceBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BulkInvoiceBatches and returns the data saved in the database.
     * @param {BulkInvoiceBatchCreateManyAndReturnArgs} args - Arguments to create many BulkInvoiceBatches.
     * @example
     * // Create many BulkInvoiceBatches
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BulkInvoiceBatches and only return the `id`
     * const bulkInvoiceBatchWithIdOnly = await prisma.bulkInvoiceBatch.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BulkInvoiceBatchCreateManyAndReturnArgs>(args?: SelectSubset<T, BulkInvoiceBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BulkInvoiceBatch.
     * @param {BulkInvoiceBatchDeleteArgs} args - Arguments to delete one BulkInvoiceBatch.
     * @example
     * // Delete one BulkInvoiceBatch
     * const BulkInvoiceBatch = await prisma.bulkInvoiceBatch.delete({
     *   where: {
     *     // ... filter to delete one BulkInvoiceBatch
     *   }
     * })
     * 
     */
    delete<T extends BulkInvoiceBatchDeleteArgs>(args: SelectSubset<T, BulkInvoiceBatchDeleteArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BulkInvoiceBatch.
     * @param {BulkInvoiceBatchUpdateArgs} args - Arguments to update one BulkInvoiceBatch.
     * @example
     * // Update one BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BulkInvoiceBatchUpdateArgs>(args: SelectSubset<T, BulkInvoiceBatchUpdateArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BulkInvoiceBatches.
     * @param {BulkInvoiceBatchDeleteManyArgs} args - Arguments to filter BulkInvoiceBatches to delete.
     * @example
     * // Delete a few BulkInvoiceBatches
     * const { count } = await prisma.bulkInvoiceBatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BulkInvoiceBatchDeleteManyArgs>(args?: SelectSubset<T, BulkInvoiceBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BulkInvoiceBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BulkInvoiceBatches
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BulkInvoiceBatchUpdateManyArgs>(args: SelectSubset<T, BulkInvoiceBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BulkInvoiceBatch.
     * @param {BulkInvoiceBatchUpsertArgs} args - Arguments to update or create a BulkInvoiceBatch.
     * @example
     * // Update or create a BulkInvoiceBatch
     * const bulkInvoiceBatch = await prisma.bulkInvoiceBatch.upsert({
     *   create: {
     *     // ... data to create a BulkInvoiceBatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BulkInvoiceBatch we want to update
     *   }
     * })
     */
    upsert<T extends BulkInvoiceBatchUpsertArgs>(args: SelectSubset<T, BulkInvoiceBatchUpsertArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BulkInvoiceBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchCountArgs} args - Arguments to filter BulkInvoiceBatches to count.
     * @example
     * // Count the number of BulkInvoiceBatches
     * const count = await prisma.bulkInvoiceBatch.count({
     *   where: {
     *     // ... the filter for the BulkInvoiceBatches we want to count
     *   }
     * })
    **/
    count<T extends BulkInvoiceBatchCountArgs>(
      args?: Subset<T, BulkInvoiceBatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BulkInvoiceBatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BulkInvoiceBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BulkInvoiceBatchAggregateArgs>(args: Subset<T, BulkInvoiceBatchAggregateArgs>): Prisma.PrismaPromise<GetBulkInvoiceBatchAggregateType<T>>

    /**
     * Group by BulkInvoiceBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceBatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BulkInvoiceBatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BulkInvoiceBatchGroupByArgs['orderBy'] }
        : { orderBy?: BulkInvoiceBatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BulkInvoiceBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBulkInvoiceBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BulkInvoiceBatch model
   */
  readonly fields: BulkInvoiceBatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BulkInvoiceBatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BulkInvoiceBatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends BulkInvoiceBatch$itemsArgs<ExtArgs> = {}>(args?: Subset<T, BulkInvoiceBatch$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BulkInvoiceBatch model
   */ 
  interface BulkInvoiceBatchFieldRefs {
    readonly id: FieldRef<"BulkInvoiceBatch", 'String'>
    readonly userId: FieldRef<"BulkInvoiceBatch", 'String'>
    readonly businessId: FieldRef<"BulkInvoiceBatch", 'String'>
    readonly fileName: FieldRef<"BulkInvoiceBatch", 'String'>
    readonly originalName: FieldRef<"BulkInvoiceBatch", 'String'>
    readonly fileSize: FieldRef<"BulkInvoiceBatch", 'Int'>
    readonly totalRecords: FieldRef<"BulkInvoiceBatch", 'Int'>
    readonly validRecords: FieldRef<"BulkInvoiceBatch", 'Int'>
    readonly invalidRecords: FieldRef<"BulkInvoiceBatch", 'Int'>
    readonly processingStatus: FieldRef<"BulkInvoiceBatch", 'ProcessingStatus'>
    readonly validationStatus: FieldRef<"BulkInvoiceBatch", 'ValidationStatus'>
    readonly validationErrors: FieldRef<"BulkInvoiceBatch", 'Json'>
    readonly processingErrors: FieldRef<"BulkInvoiceBatch", 'Json'>
    readonly uploadedAt: FieldRef<"BulkInvoiceBatch", 'DateTime'>
    readonly processedAt: FieldRef<"BulkInvoiceBatch", 'DateTime'>
    readonly completedAt: FieldRef<"BulkInvoiceBatch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BulkInvoiceBatch findUnique
   */
  export type BulkInvoiceBatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceBatch to fetch.
     */
    where: BulkInvoiceBatchWhereUniqueInput
  }

  /**
   * BulkInvoiceBatch findUniqueOrThrow
   */
  export type BulkInvoiceBatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceBatch to fetch.
     */
    where: BulkInvoiceBatchWhereUniqueInput
  }

  /**
   * BulkInvoiceBatch findFirst
   */
  export type BulkInvoiceBatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceBatch to fetch.
     */
    where?: BulkInvoiceBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceBatches to fetch.
     */
    orderBy?: BulkInvoiceBatchOrderByWithRelationInput | BulkInvoiceBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkInvoiceBatches.
     */
    cursor?: BulkInvoiceBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkInvoiceBatches.
     */
    distinct?: BulkInvoiceBatchScalarFieldEnum | BulkInvoiceBatchScalarFieldEnum[]
  }

  /**
   * BulkInvoiceBatch findFirstOrThrow
   */
  export type BulkInvoiceBatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceBatch to fetch.
     */
    where?: BulkInvoiceBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceBatches to fetch.
     */
    orderBy?: BulkInvoiceBatchOrderByWithRelationInput | BulkInvoiceBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkInvoiceBatches.
     */
    cursor?: BulkInvoiceBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkInvoiceBatches.
     */
    distinct?: BulkInvoiceBatchScalarFieldEnum | BulkInvoiceBatchScalarFieldEnum[]
  }

  /**
   * BulkInvoiceBatch findMany
   */
  export type BulkInvoiceBatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceBatches to fetch.
     */
    where?: BulkInvoiceBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceBatches to fetch.
     */
    orderBy?: BulkInvoiceBatchOrderByWithRelationInput | BulkInvoiceBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BulkInvoiceBatches.
     */
    cursor?: BulkInvoiceBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceBatches.
     */
    skip?: number
    distinct?: BulkInvoiceBatchScalarFieldEnum | BulkInvoiceBatchScalarFieldEnum[]
  }

  /**
   * BulkInvoiceBatch create
   */
  export type BulkInvoiceBatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * The data needed to create a BulkInvoiceBatch.
     */
    data: XOR<BulkInvoiceBatchCreateInput, BulkInvoiceBatchUncheckedCreateInput>
  }

  /**
   * BulkInvoiceBatch createMany
   */
  export type BulkInvoiceBatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BulkInvoiceBatches.
     */
    data: BulkInvoiceBatchCreateManyInput | BulkInvoiceBatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BulkInvoiceBatch createManyAndReturn
   */
  export type BulkInvoiceBatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BulkInvoiceBatches.
     */
    data: BulkInvoiceBatchCreateManyInput | BulkInvoiceBatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BulkInvoiceBatch update
   */
  export type BulkInvoiceBatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * The data needed to update a BulkInvoiceBatch.
     */
    data: XOR<BulkInvoiceBatchUpdateInput, BulkInvoiceBatchUncheckedUpdateInput>
    /**
     * Choose, which BulkInvoiceBatch to update.
     */
    where: BulkInvoiceBatchWhereUniqueInput
  }

  /**
   * BulkInvoiceBatch updateMany
   */
  export type BulkInvoiceBatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BulkInvoiceBatches.
     */
    data: XOR<BulkInvoiceBatchUpdateManyMutationInput, BulkInvoiceBatchUncheckedUpdateManyInput>
    /**
     * Filter which BulkInvoiceBatches to update
     */
    where?: BulkInvoiceBatchWhereInput
  }

  /**
   * BulkInvoiceBatch upsert
   */
  export type BulkInvoiceBatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * The filter to search for the BulkInvoiceBatch to update in case it exists.
     */
    where: BulkInvoiceBatchWhereUniqueInput
    /**
     * In case the BulkInvoiceBatch found by the `where` argument doesn't exist, create a new BulkInvoiceBatch with this data.
     */
    create: XOR<BulkInvoiceBatchCreateInput, BulkInvoiceBatchUncheckedCreateInput>
    /**
     * In case the BulkInvoiceBatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BulkInvoiceBatchUpdateInput, BulkInvoiceBatchUncheckedUpdateInput>
  }

  /**
   * BulkInvoiceBatch delete
   */
  export type BulkInvoiceBatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
    /**
     * Filter which BulkInvoiceBatch to delete.
     */
    where: BulkInvoiceBatchWhereUniqueInput
  }

  /**
   * BulkInvoiceBatch deleteMany
   */
  export type BulkInvoiceBatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkInvoiceBatches to delete
     */
    where?: BulkInvoiceBatchWhereInput
  }

  /**
   * BulkInvoiceBatch.items
   */
  export type BulkInvoiceBatch$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    where?: BulkInvoiceItemWhereInput
    orderBy?: BulkInvoiceItemOrderByWithRelationInput | BulkInvoiceItemOrderByWithRelationInput[]
    cursor?: BulkInvoiceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BulkInvoiceItemScalarFieldEnum | BulkInvoiceItemScalarFieldEnum[]
  }

  /**
   * BulkInvoiceBatch without action
   */
  export type BulkInvoiceBatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceBatch
     */
    select?: BulkInvoiceBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceBatchInclude<ExtArgs> | null
  }


  /**
   * Model BulkInvoiceItem
   */

  export type AggregateBulkInvoiceItem = {
    _count: BulkInvoiceItemCountAggregateOutputType | null
    _avg: BulkInvoiceItemAvgAggregateOutputType | null
    _sum: BulkInvoiceItemSumAggregateOutputType | null
    _min: BulkInvoiceItemMinAggregateOutputType | null
    _max: BulkInvoiceItemMaxAggregateOutputType | null
  }

  export type BulkInvoiceItemAvgAggregateOutputType = {
    rowNumber: number | null
  }

  export type BulkInvoiceItemSumAggregateOutputType = {
    rowNumber: number | null
  }

  export type BulkInvoiceItemMinAggregateOutputType = {
    id: string | null
    batchId: string | null
    rowNumber: number | null
    localId: string | null
    dataValid: boolean | null
    sandboxValidated: boolean | null
    sandboxSubmitted: boolean | null
    productionSubmitted: boolean | null
    fbrInvoiceNumber: string | null
    processedAt: Date | null
  }

  export type BulkInvoiceItemMaxAggregateOutputType = {
    id: string | null
    batchId: string | null
    rowNumber: number | null
    localId: string | null
    dataValid: boolean | null
    sandboxValidated: boolean | null
    sandboxSubmitted: boolean | null
    productionSubmitted: boolean | null
    fbrInvoiceNumber: string | null
    processedAt: Date | null
  }

  export type BulkInvoiceItemCountAggregateOutputType = {
    id: number
    batchId: number
    rowNumber: number
    localId: number
    dataValid: number
    sandboxValidated: number
    sandboxSubmitted: number
    productionSubmitted: number
    validationErrors: number
    sandboxResponse: number
    productionResponse: number
    fbrInvoiceNumber: number
    invoiceData: number
    processedAt: number
    _all: number
  }


  export type BulkInvoiceItemAvgAggregateInputType = {
    rowNumber?: true
  }

  export type BulkInvoiceItemSumAggregateInputType = {
    rowNumber?: true
  }

  export type BulkInvoiceItemMinAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    localId?: true
    dataValid?: true
    sandboxValidated?: true
    sandboxSubmitted?: true
    productionSubmitted?: true
    fbrInvoiceNumber?: true
    processedAt?: true
  }

  export type BulkInvoiceItemMaxAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    localId?: true
    dataValid?: true
    sandboxValidated?: true
    sandboxSubmitted?: true
    productionSubmitted?: true
    fbrInvoiceNumber?: true
    processedAt?: true
  }

  export type BulkInvoiceItemCountAggregateInputType = {
    id?: true
    batchId?: true
    rowNumber?: true
    localId?: true
    dataValid?: true
    sandboxValidated?: true
    sandboxSubmitted?: true
    productionSubmitted?: true
    validationErrors?: true
    sandboxResponse?: true
    productionResponse?: true
    fbrInvoiceNumber?: true
    invoiceData?: true
    processedAt?: true
    _all?: true
  }

  export type BulkInvoiceItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkInvoiceItem to aggregate.
     */
    where?: BulkInvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceItems to fetch.
     */
    orderBy?: BulkInvoiceItemOrderByWithRelationInput | BulkInvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BulkInvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BulkInvoiceItems
    **/
    _count?: true | BulkInvoiceItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BulkInvoiceItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BulkInvoiceItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BulkInvoiceItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BulkInvoiceItemMaxAggregateInputType
  }

  export type GetBulkInvoiceItemAggregateType<T extends BulkInvoiceItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBulkInvoiceItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBulkInvoiceItem[P]>
      : GetScalarType<T[P], AggregateBulkInvoiceItem[P]>
  }




  export type BulkInvoiceItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BulkInvoiceItemWhereInput
    orderBy?: BulkInvoiceItemOrderByWithAggregationInput | BulkInvoiceItemOrderByWithAggregationInput[]
    by: BulkInvoiceItemScalarFieldEnum[] | BulkInvoiceItemScalarFieldEnum
    having?: BulkInvoiceItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BulkInvoiceItemCountAggregateInputType | true
    _avg?: BulkInvoiceItemAvgAggregateInputType
    _sum?: BulkInvoiceItemSumAggregateInputType
    _min?: BulkInvoiceItemMinAggregateInputType
    _max?: BulkInvoiceItemMaxAggregateInputType
  }

  export type BulkInvoiceItemGroupByOutputType = {
    id: string
    batchId: string
    rowNumber: number
    localId: string
    dataValid: boolean
    sandboxValidated: boolean
    sandboxSubmitted: boolean
    productionSubmitted: boolean
    validationErrors: JsonValue | null
    sandboxResponse: JsonValue | null
    productionResponse: JsonValue | null
    fbrInvoiceNumber: string | null
    invoiceData: JsonValue
    processedAt: Date | null
    _count: BulkInvoiceItemCountAggregateOutputType | null
    _avg: BulkInvoiceItemAvgAggregateOutputType | null
    _sum: BulkInvoiceItemSumAggregateOutputType | null
    _min: BulkInvoiceItemMinAggregateOutputType | null
    _max: BulkInvoiceItemMaxAggregateOutputType | null
  }

  type GetBulkInvoiceItemGroupByPayload<T extends BulkInvoiceItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BulkInvoiceItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BulkInvoiceItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BulkInvoiceItemGroupByOutputType[P]>
            : GetScalarType<T[P], BulkInvoiceItemGroupByOutputType[P]>
        }
      >
    >


  export type BulkInvoiceItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    localId?: boolean
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: boolean
    sandboxResponse?: boolean
    productionResponse?: boolean
    fbrInvoiceNumber?: boolean
    invoiceData?: boolean
    processedAt?: boolean
    batch?: boolean | BulkInvoiceBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bulkInvoiceItem"]>

  export type BulkInvoiceItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    localId?: boolean
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: boolean
    sandboxResponse?: boolean
    productionResponse?: boolean
    fbrInvoiceNumber?: boolean
    invoiceData?: boolean
    processedAt?: boolean
    batch?: boolean | BulkInvoiceBatchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bulkInvoiceItem"]>

  export type BulkInvoiceItemSelectScalar = {
    id?: boolean
    batchId?: boolean
    rowNumber?: boolean
    localId?: boolean
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: boolean
    sandboxResponse?: boolean
    productionResponse?: boolean
    fbrInvoiceNumber?: boolean
    invoiceData?: boolean
    processedAt?: boolean
  }

  export type BulkInvoiceItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | BulkInvoiceBatchDefaultArgs<ExtArgs>
  }
  export type BulkInvoiceItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    batch?: boolean | BulkInvoiceBatchDefaultArgs<ExtArgs>
  }

  export type $BulkInvoiceItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BulkInvoiceItem"
    objects: {
      batch: Prisma.$BulkInvoiceBatchPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      batchId: string
      rowNumber: number
      localId: string
      dataValid: boolean
      sandboxValidated: boolean
      sandboxSubmitted: boolean
      productionSubmitted: boolean
      validationErrors: Prisma.JsonValue | null
      sandboxResponse: Prisma.JsonValue | null
      productionResponse: Prisma.JsonValue | null
      fbrInvoiceNumber: string | null
      invoiceData: Prisma.JsonValue
      processedAt: Date | null
    }, ExtArgs["result"]["bulkInvoiceItem"]>
    composites: {}
  }

  type BulkInvoiceItemGetPayload<S extends boolean | null | undefined | BulkInvoiceItemDefaultArgs> = $Result.GetResult<Prisma.$BulkInvoiceItemPayload, S>

  type BulkInvoiceItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BulkInvoiceItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BulkInvoiceItemCountAggregateInputType | true
    }

  export interface BulkInvoiceItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BulkInvoiceItem'], meta: { name: 'BulkInvoiceItem' } }
    /**
     * Find zero or one BulkInvoiceItem that matches the filter.
     * @param {BulkInvoiceItemFindUniqueArgs} args - Arguments to find a BulkInvoiceItem
     * @example
     * // Get one BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BulkInvoiceItemFindUniqueArgs>(args: SelectSubset<T, BulkInvoiceItemFindUniqueArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BulkInvoiceItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BulkInvoiceItemFindUniqueOrThrowArgs} args - Arguments to find a BulkInvoiceItem
     * @example
     * // Get one BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BulkInvoiceItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BulkInvoiceItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BulkInvoiceItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemFindFirstArgs} args - Arguments to find a BulkInvoiceItem
     * @example
     * // Get one BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BulkInvoiceItemFindFirstArgs>(args?: SelectSubset<T, BulkInvoiceItemFindFirstArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BulkInvoiceItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemFindFirstOrThrowArgs} args - Arguments to find a BulkInvoiceItem
     * @example
     * // Get one BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BulkInvoiceItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BulkInvoiceItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BulkInvoiceItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BulkInvoiceItems
     * const bulkInvoiceItems = await prisma.bulkInvoiceItem.findMany()
     * 
     * // Get first 10 BulkInvoiceItems
     * const bulkInvoiceItems = await prisma.bulkInvoiceItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bulkInvoiceItemWithIdOnly = await prisma.bulkInvoiceItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BulkInvoiceItemFindManyArgs>(args?: SelectSubset<T, BulkInvoiceItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BulkInvoiceItem.
     * @param {BulkInvoiceItemCreateArgs} args - Arguments to create a BulkInvoiceItem.
     * @example
     * // Create one BulkInvoiceItem
     * const BulkInvoiceItem = await prisma.bulkInvoiceItem.create({
     *   data: {
     *     // ... data to create a BulkInvoiceItem
     *   }
     * })
     * 
     */
    create<T extends BulkInvoiceItemCreateArgs>(args: SelectSubset<T, BulkInvoiceItemCreateArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BulkInvoiceItems.
     * @param {BulkInvoiceItemCreateManyArgs} args - Arguments to create many BulkInvoiceItems.
     * @example
     * // Create many BulkInvoiceItems
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BulkInvoiceItemCreateManyArgs>(args?: SelectSubset<T, BulkInvoiceItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BulkInvoiceItems and returns the data saved in the database.
     * @param {BulkInvoiceItemCreateManyAndReturnArgs} args - Arguments to create many BulkInvoiceItems.
     * @example
     * // Create many BulkInvoiceItems
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BulkInvoiceItems and only return the `id`
     * const bulkInvoiceItemWithIdOnly = await prisma.bulkInvoiceItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BulkInvoiceItemCreateManyAndReturnArgs>(args?: SelectSubset<T, BulkInvoiceItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BulkInvoiceItem.
     * @param {BulkInvoiceItemDeleteArgs} args - Arguments to delete one BulkInvoiceItem.
     * @example
     * // Delete one BulkInvoiceItem
     * const BulkInvoiceItem = await prisma.bulkInvoiceItem.delete({
     *   where: {
     *     // ... filter to delete one BulkInvoiceItem
     *   }
     * })
     * 
     */
    delete<T extends BulkInvoiceItemDeleteArgs>(args: SelectSubset<T, BulkInvoiceItemDeleteArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BulkInvoiceItem.
     * @param {BulkInvoiceItemUpdateArgs} args - Arguments to update one BulkInvoiceItem.
     * @example
     * // Update one BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BulkInvoiceItemUpdateArgs>(args: SelectSubset<T, BulkInvoiceItemUpdateArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BulkInvoiceItems.
     * @param {BulkInvoiceItemDeleteManyArgs} args - Arguments to filter BulkInvoiceItems to delete.
     * @example
     * // Delete a few BulkInvoiceItems
     * const { count } = await prisma.bulkInvoiceItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BulkInvoiceItemDeleteManyArgs>(args?: SelectSubset<T, BulkInvoiceItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BulkInvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BulkInvoiceItems
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BulkInvoiceItemUpdateManyArgs>(args: SelectSubset<T, BulkInvoiceItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BulkInvoiceItem.
     * @param {BulkInvoiceItemUpsertArgs} args - Arguments to update or create a BulkInvoiceItem.
     * @example
     * // Update or create a BulkInvoiceItem
     * const bulkInvoiceItem = await prisma.bulkInvoiceItem.upsert({
     *   create: {
     *     // ... data to create a BulkInvoiceItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BulkInvoiceItem we want to update
     *   }
     * })
     */
    upsert<T extends BulkInvoiceItemUpsertArgs>(args: SelectSubset<T, BulkInvoiceItemUpsertArgs<ExtArgs>>): Prisma__BulkInvoiceItemClient<$Result.GetResult<Prisma.$BulkInvoiceItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BulkInvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemCountArgs} args - Arguments to filter BulkInvoiceItems to count.
     * @example
     * // Count the number of BulkInvoiceItems
     * const count = await prisma.bulkInvoiceItem.count({
     *   where: {
     *     // ... the filter for the BulkInvoiceItems we want to count
     *   }
     * })
    **/
    count<T extends BulkInvoiceItemCountArgs>(
      args?: Subset<T, BulkInvoiceItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BulkInvoiceItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BulkInvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BulkInvoiceItemAggregateArgs>(args: Subset<T, BulkInvoiceItemAggregateArgs>): Prisma.PrismaPromise<GetBulkInvoiceItemAggregateType<T>>

    /**
     * Group by BulkInvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BulkInvoiceItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BulkInvoiceItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BulkInvoiceItemGroupByArgs['orderBy'] }
        : { orderBy?: BulkInvoiceItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BulkInvoiceItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBulkInvoiceItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BulkInvoiceItem model
   */
  readonly fields: BulkInvoiceItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BulkInvoiceItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BulkInvoiceItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    batch<T extends BulkInvoiceBatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BulkInvoiceBatchDefaultArgs<ExtArgs>>): Prisma__BulkInvoiceBatchClient<$Result.GetResult<Prisma.$BulkInvoiceBatchPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BulkInvoiceItem model
   */ 
  interface BulkInvoiceItemFieldRefs {
    readonly id: FieldRef<"BulkInvoiceItem", 'String'>
    readonly batchId: FieldRef<"BulkInvoiceItem", 'String'>
    readonly rowNumber: FieldRef<"BulkInvoiceItem", 'Int'>
    readonly localId: FieldRef<"BulkInvoiceItem", 'String'>
    readonly dataValid: FieldRef<"BulkInvoiceItem", 'Boolean'>
    readonly sandboxValidated: FieldRef<"BulkInvoiceItem", 'Boolean'>
    readonly sandboxSubmitted: FieldRef<"BulkInvoiceItem", 'Boolean'>
    readonly productionSubmitted: FieldRef<"BulkInvoiceItem", 'Boolean'>
    readonly validationErrors: FieldRef<"BulkInvoiceItem", 'Json'>
    readonly sandboxResponse: FieldRef<"BulkInvoiceItem", 'Json'>
    readonly productionResponse: FieldRef<"BulkInvoiceItem", 'Json'>
    readonly fbrInvoiceNumber: FieldRef<"BulkInvoiceItem", 'String'>
    readonly invoiceData: FieldRef<"BulkInvoiceItem", 'Json'>
    readonly processedAt: FieldRef<"BulkInvoiceItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BulkInvoiceItem findUnique
   */
  export type BulkInvoiceItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceItem to fetch.
     */
    where: BulkInvoiceItemWhereUniqueInput
  }

  /**
   * BulkInvoiceItem findUniqueOrThrow
   */
  export type BulkInvoiceItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceItem to fetch.
     */
    where: BulkInvoiceItemWhereUniqueInput
  }

  /**
   * BulkInvoiceItem findFirst
   */
  export type BulkInvoiceItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceItem to fetch.
     */
    where?: BulkInvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceItems to fetch.
     */
    orderBy?: BulkInvoiceItemOrderByWithRelationInput | BulkInvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkInvoiceItems.
     */
    cursor?: BulkInvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkInvoiceItems.
     */
    distinct?: BulkInvoiceItemScalarFieldEnum | BulkInvoiceItemScalarFieldEnum[]
  }

  /**
   * BulkInvoiceItem findFirstOrThrow
   */
  export type BulkInvoiceItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceItem to fetch.
     */
    where?: BulkInvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceItems to fetch.
     */
    orderBy?: BulkInvoiceItemOrderByWithRelationInput | BulkInvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BulkInvoiceItems.
     */
    cursor?: BulkInvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BulkInvoiceItems.
     */
    distinct?: BulkInvoiceItemScalarFieldEnum | BulkInvoiceItemScalarFieldEnum[]
  }

  /**
   * BulkInvoiceItem findMany
   */
  export type BulkInvoiceItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which BulkInvoiceItems to fetch.
     */
    where?: BulkInvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BulkInvoiceItems to fetch.
     */
    orderBy?: BulkInvoiceItemOrderByWithRelationInput | BulkInvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BulkInvoiceItems.
     */
    cursor?: BulkInvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BulkInvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BulkInvoiceItems.
     */
    skip?: number
    distinct?: BulkInvoiceItemScalarFieldEnum | BulkInvoiceItemScalarFieldEnum[]
  }

  /**
   * BulkInvoiceItem create
   */
  export type BulkInvoiceItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BulkInvoiceItem.
     */
    data: XOR<BulkInvoiceItemCreateInput, BulkInvoiceItemUncheckedCreateInput>
  }

  /**
   * BulkInvoiceItem createMany
   */
  export type BulkInvoiceItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BulkInvoiceItems.
     */
    data: BulkInvoiceItemCreateManyInput | BulkInvoiceItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BulkInvoiceItem createManyAndReturn
   */
  export type BulkInvoiceItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BulkInvoiceItems.
     */
    data: BulkInvoiceItemCreateManyInput | BulkInvoiceItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BulkInvoiceItem update
   */
  export type BulkInvoiceItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BulkInvoiceItem.
     */
    data: XOR<BulkInvoiceItemUpdateInput, BulkInvoiceItemUncheckedUpdateInput>
    /**
     * Choose, which BulkInvoiceItem to update.
     */
    where: BulkInvoiceItemWhereUniqueInput
  }

  /**
   * BulkInvoiceItem updateMany
   */
  export type BulkInvoiceItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BulkInvoiceItems.
     */
    data: XOR<BulkInvoiceItemUpdateManyMutationInput, BulkInvoiceItemUncheckedUpdateManyInput>
    /**
     * Filter which BulkInvoiceItems to update
     */
    where?: BulkInvoiceItemWhereInput
  }

  /**
   * BulkInvoiceItem upsert
   */
  export type BulkInvoiceItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BulkInvoiceItem to update in case it exists.
     */
    where: BulkInvoiceItemWhereUniqueInput
    /**
     * In case the BulkInvoiceItem found by the `where` argument doesn't exist, create a new BulkInvoiceItem with this data.
     */
    create: XOR<BulkInvoiceItemCreateInput, BulkInvoiceItemUncheckedCreateInput>
    /**
     * In case the BulkInvoiceItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BulkInvoiceItemUpdateInput, BulkInvoiceItemUncheckedUpdateInput>
  }

  /**
   * BulkInvoiceItem delete
   */
  export type BulkInvoiceItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
    /**
     * Filter which BulkInvoiceItem to delete.
     */
    where: BulkInvoiceItemWhereUniqueInput
  }

  /**
   * BulkInvoiceItem deleteMany
   */
  export type BulkInvoiceItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BulkInvoiceItems to delete
     */
    where?: BulkInvoiceItemWhereInput
  }

  /**
   * BulkInvoiceItem without action
   */
  export type BulkInvoiceItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BulkInvoiceItem
     */
    select?: BulkInvoiceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BulkInvoiceItemInclude<ExtArgs> | null
  }


  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    id: number
    key: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SystemConfigMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemConfigs
    **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }




  export type SystemConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    id: string
    key: string
    value: string
    createdAt: Date
    updatedAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
        }
      >
    >


  export type SystemConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SystemConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["systemConfig"]>
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> = $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig'], meta: { name: 'SystemConfig' } }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     * 
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemConfigFindManyArgs>(args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     * 
     */
    create<T extends SystemConfigCreateArgs>(args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemConfigCreateManyArgs>(args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     * 
     */
    delete<T extends SystemConfigDeleteArgs>(args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemConfigUpdateArgs>(args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
    **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemConfigAggregateArgs>(args: Subset<T, SystemConfigAggregateArgs>): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemConfig model
   */
  readonly fields: SystemConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemConfig model
   */ 
  interface SystemConfigFieldRefs {
    readonly id: FieldRef<"SystemConfig", 'String'>
    readonly key: FieldRef<"SystemConfig", 'String'>
    readonly value: FieldRef<"SystemConfig", 'String'>
    readonly createdAt: FieldRef<"SystemConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"SystemConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    businessId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    businessId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    businessId: number
    action: number
    entityType: number
    entityId: number
    oldValues: number
    newValues: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    action?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    action?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    businessId?: true
    action?: true
    entityType?: true
    entityId?: true
    oldValues?: true
    newValues?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string | null
    businessId: string | null
    action: string
    entityType: string
    entityId: string | null
    oldValues: JsonValue | null
    newValues: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    businessId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValues?: boolean
    newValues?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    businessId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValues?: boolean
    newValues?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    businessId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    oldValues?: boolean
    newValues?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }


  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      businessId: string | null
      action: string
      entityType: string
      entityId: string | null
      oldValues: Prisma.JsonValue | null
      newValues: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly businessId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly oldValues: FieldRef<"AuditLog", 'Json'>
    readonly newValues: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
  }


  /**
   * Model FBRScenario
   */

  export type AggregateFBRScenario = {
    _count: FBRScenarioCountAggregateOutputType | null
    _avg: FBRScenarioAvgAggregateOutputType | null
    _sum: FBRScenarioSumAggregateOutputType | null
    _min: FBRScenarioMinAggregateOutputType | null
    _max: FBRScenarioMaxAggregateOutputType | null
  }

  export type FBRScenarioAvgAggregateOutputType = {
    taxRateApplicable: number | null
    priority: number | null
  }

  export type FBRScenarioSumAggregateOutputType = {
    taxRateApplicable: number | null
    priority: number | null
  }

  export type FBRScenarioMinAggregateOutputType = {
    code: string | null
    description: string | null
    businessType: string | null
    sector: string | null
    isActive: boolean | null
    registrationType: string | null
    transactionType: string | null
    taxRateApplicable: number | null
    effectiveFrom: Date | null
    effectiveTo: Date | null
    priority: number | null
    saleType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FBRScenarioMaxAggregateOutputType = {
    code: string | null
    description: string | null
    businessType: string | null
    sector: string | null
    isActive: boolean | null
    registrationType: string | null
    transactionType: string | null
    taxRateApplicable: number | null
    effectiveFrom: Date | null
    effectiveTo: Date | null
    priority: number | null
    saleType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FBRScenarioCountAggregateOutputType = {
    code: number
    description: number
    businessType: number
    sector: number
    isActive: number
    registrationType: number
    transactionType: number
    taxRateApplicable: number
    specialConditions: number
    provinceRestrictions: number
    effectiveFrom: number
    effectiveTo: number
    priority: number
    saleType: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FBRScenarioAvgAggregateInputType = {
    taxRateApplicable?: true
    priority?: true
  }

  export type FBRScenarioSumAggregateInputType = {
    taxRateApplicable?: true
    priority?: true
  }

  export type FBRScenarioMinAggregateInputType = {
    code?: true
    description?: true
    businessType?: true
    sector?: true
    isActive?: true
    registrationType?: true
    transactionType?: true
    taxRateApplicable?: true
    effectiveFrom?: true
    effectiveTo?: true
    priority?: true
    saleType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FBRScenarioMaxAggregateInputType = {
    code?: true
    description?: true
    businessType?: true
    sector?: true
    isActive?: true
    registrationType?: true
    transactionType?: true
    taxRateApplicable?: true
    effectiveFrom?: true
    effectiveTo?: true
    priority?: true
    saleType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FBRScenarioCountAggregateInputType = {
    code?: true
    description?: true
    businessType?: true
    sector?: true
    isActive?: true
    registrationType?: true
    transactionType?: true
    taxRateApplicable?: true
    specialConditions?: true
    provinceRestrictions?: true
    effectiveFrom?: true
    effectiveTo?: true
    priority?: true
    saleType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FBRScenarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBRScenario to aggregate.
     */
    where?: FBRScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRScenarios to fetch.
     */
    orderBy?: FBRScenarioOrderByWithRelationInput | FBRScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FBRScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FBRScenarios
    **/
    _count?: true | FBRScenarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FBRScenarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FBRScenarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FBRScenarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FBRScenarioMaxAggregateInputType
  }

  export type GetFBRScenarioAggregateType<T extends FBRScenarioAggregateArgs> = {
        [P in keyof T & keyof AggregateFBRScenario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFBRScenario[P]>
      : GetScalarType<T[P], AggregateFBRScenario[P]>
  }




  export type FBRScenarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FBRScenarioWhereInput
    orderBy?: FBRScenarioOrderByWithAggregationInput | FBRScenarioOrderByWithAggregationInput[]
    by: FBRScenarioScalarFieldEnum[] | FBRScenarioScalarFieldEnum
    having?: FBRScenarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FBRScenarioCountAggregateInputType | true
    _avg?: FBRScenarioAvgAggregateInputType
    _sum?: FBRScenarioSumAggregateInputType
    _min?: FBRScenarioMinAggregateInputType
    _max?: FBRScenarioMaxAggregateInputType
  }

  export type FBRScenarioGroupByOutputType = {
    code: string
    description: string
    businessType: string | null
    sector: string | null
    isActive: boolean
    registrationType: string | null
    transactionType: string | null
    taxRateApplicable: number | null
    specialConditions: string[]
    provinceRestrictions: string[]
    effectiveFrom: Date | null
    effectiveTo: Date | null
    priority: number | null
    saleType: string | null
    createdAt: Date
    updatedAt: Date
    _count: FBRScenarioCountAggregateOutputType | null
    _avg: FBRScenarioAvgAggregateOutputType | null
    _sum: FBRScenarioSumAggregateOutputType | null
    _min: FBRScenarioMinAggregateOutputType | null
    _max: FBRScenarioMaxAggregateOutputType | null
  }

  type GetFBRScenarioGroupByPayload<T extends FBRScenarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FBRScenarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FBRScenarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FBRScenarioGroupByOutputType[P]>
            : GetScalarType<T[P], FBRScenarioGroupByOutputType[P]>
        }
      >
    >


  export type FBRScenarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    description?: boolean
    businessType?: boolean
    sector?: boolean
    isActive?: boolean
    registrationType?: boolean
    transactionType?: boolean
    taxRateApplicable?: boolean
    specialConditions?: boolean
    provinceRestrictions?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    priority?: boolean
    saleType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fBRScenario"]>

  export type FBRScenarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    description?: boolean
    businessType?: boolean
    sector?: boolean
    isActive?: boolean
    registrationType?: boolean
    transactionType?: boolean
    taxRateApplicable?: boolean
    specialConditions?: boolean
    provinceRestrictions?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    priority?: boolean
    saleType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fBRScenario"]>

  export type FBRScenarioSelectScalar = {
    code?: boolean
    description?: boolean
    businessType?: boolean
    sector?: boolean
    isActive?: boolean
    registrationType?: boolean
    transactionType?: boolean
    taxRateApplicable?: boolean
    specialConditions?: boolean
    provinceRestrictions?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    priority?: boolean
    saleType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $FBRScenarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FBRScenario"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      code: string
      description: string
      businessType: string | null
      sector: string | null
      isActive: boolean
      registrationType: string | null
      transactionType: string | null
      taxRateApplicable: number | null
      specialConditions: string[]
      provinceRestrictions: string[]
      effectiveFrom: Date | null
      effectiveTo: Date | null
      priority: number | null
      saleType: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fBRScenario"]>
    composites: {}
  }

  type FBRScenarioGetPayload<S extends boolean | null | undefined | FBRScenarioDefaultArgs> = $Result.GetResult<Prisma.$FBRScenarioPayload, S>

  type FBRScenarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FBRScenarioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FBRScenarioCountAggregateInputType | true
    }

  export interface FBRScenarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FBRScenario'], meta: { name: 'FBRScenario' } }
    /**
     * Find zero or one FBRScenario that matches the filter.
     * @param {FBRScenarioFindUniqueArgs} args - Arguments to find a FBRScenario
     * @example
     * // Get one FBRScenario
     * const fBRScenario = await prisma.fBRScenario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FBRScenarioFindUniqueArgs>(args: SelectSubset<T, FBRScenarioFindUniqueArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FBRScenario that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FBRScenarioFindUniqueOrThrowArgs} args - Arguments to find a FBRScenario
     * @example
     * // Get one FBRScenario
     * const fBRScenario = await prisma.fBRScenario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FBRScenarioFindUniqueOrThrowArgs>(args: SelectSubset<T, FBRScenarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FBRScenario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioFindFirstArgs} args - Arguments to find a FBRScenario
     * @example
     * // Get one FBRScenario
     * const fBRScenario = await prisma.fBRScenario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FBRScenarioFindFirstArgs>(args?: SelectSubset<T, FBRScenarioFindFirstArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FBRScenario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioFindFirstOrThrowArgs} args - Arguments to find a FBRScenario
     * @example
     * // Get one FBRScenario
     * const fBRScenario = await prisma.fBRScenario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FBRScenarioFindFirstOrThrowArgs>(args?: SelectSubset<T, FBRScenarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FBRScenarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FBRScenarios
     * const fBRScenarios = await prisma.fBRScenario.findMany()
     * 
     * // Get first 10 FBRScenarios
     * const fBRScenarios = await prisma.fBRScenario.findMany({ take: 10 })
     * 
     * // Only select the `code`
     * const fBRScenarioWithCodeOnly = await prisma.fBRScenario.findMany({ select: { code: true } })
     * 
     */
    findMany<T extends FBRScenarioFindManyArgs>(args?: SelectSubset<T, FBRScenarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FBRScenario.
     * @param {FBRScenarioCreateArgs} args - Arguments to create a FBRScenario.
     * @example
     * // Create one FBRScenario
     * const FBRScenario = await prisma.fBRScenario.create({
     *   data: {
     *     // ... data to create a FBRScenario
     *   }
     * })
     * 
     */
    create<T extends FBRScenarioCreateArgs>(args: SelectSubset<T, FBRScenarioCreateArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FBRScenarios.
     * @param {FBRScenarioCreateManyArgs} args - Arguments to create many FBRScenarios.
     * @example
     * // Create many FBRScenarios
     * const fBRScenario = await prisma.fBRScenario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FBRScenarioCreateManyArgs>(args?: SelectSubset<T, FBRScenarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FBRScenarios and returns the data saved in the database.
     * @param {FBRScenarioCreateManyAndReturnArgs} args - Arguments to create many FBRScenarios.
     * @example
     * // Create many FBRScenarios
     * const fBRScenario = await prisma.fBRScenario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FBRScenarios and only return the `code`
     * const fBRScenarioWithCodeOnly = await prisma.fBRScenario.createManyAndReturn({ 
     *   select: { code: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FBRScenarioCreateManyAndReturnArgs>(args?: SelectSubset<T, FBRScenarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FBRScenario.
     * @param {FBRScenarioDeleteArgs} args - Arguments to delete one FBRScenario.
     * @example
     * // Delete one FBRScenario
     * const FBRScenario = await prisma.fBRScenario.delete({
     *   where: {
     *     // ... filter to delete one FBRScenario
     *   }
     * })
     * 
     */
    delete<T extends FBRScenarioDeleteArgs>(args: SelectSubset<T, FBRScenarioDeleteArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FBRScenario.
     * @param {FBRScenarioUpdateArgs} args - Arguments to update one FBRScenario.
     * @example
     * // Update one FBRScenario
     * const fBRScenario = await prisma.fBRScenario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FBRScenarioUpdateArgs>(args: SelectSubset<T, FBRScenarioUpdateArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FBRScenarios.
     * @param {FBRScenarioDeleteManyArgs} args - Arguments to filter FBRScenarios to delete.
     * @example
     * // Delete a few FBRScenarios
     * const { count } = await prisma.fBRScenario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FBRScenarioDeleteManyArgs>(args?: SelectSubset<T, FBRScenarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FBRScenarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FBRScenarios
     * const fBRScenario = await prisma.fBRScenario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FBRScenarioUpdateManyArgs>(args: SelectSubset<T, FBRScenarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FBRScenario.
     * @param {FBRScenarioUpsertArgs} args - Arguments to update or create a FBRScenario.
     * @example
     * // Update or create a FBRScenario
     * const fBRScenario = await prisma.fBRScenario.upsert({
     *   create: {
     *     // ... data to create a FBRScenario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FBRScenario we want to update
     *   }
     * })
     */
    upsert<T extends FBRScenarioUpsertArgs>(args: SelectSubset<T, FBRScenarioUpsertArgs<ExtArgs>>): Prisma__FBRScenarioClient<$Result.GetResult<Prisma.$FBRScenarioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FBRScenarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioCountArgs} args - Arguments to filter FBRScenarios to count.
     * @example
     * // Count the number of FBRScenarios
     * const count = await prisma.fBRScenario.count({
     *   where: {
     *     // ... the filter for the FBRScenarios we want to count
     *   }
     * })
    **/
    count<T extends FBRScenarioCountArgs>(
      args?: Subset<T, FBRScenarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FBRScenarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FBRScenario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FBRScenarioAggregateArgs>(args: Subset<T, FBRScenarioAggregateArgs>): Prisma.PrismaPromise<GetFBRScenarioAggregateType<T>>

    /**
     * Group by FBRScenario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRScenarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FBRScenarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FBRScenarioGroupByArgs['orderBy'] }
        : { orderBy?: FBRScenarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FBRScenarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFBRScenarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FBRScenario model
   */
  readonly fields: FBRScenarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FBRScenario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FBRScenarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FBRScenario model
   */ 
  interface FBRScenarioFieldRefs {
    readonly code: FieldRef<"FBRScenario", 'String'>
    readonly description: FieldRef<"FBRScenario", 'String'>
    readonly businessType: FieldRef<"FBRScenario", 'String'>
    readonly sector: FieldRef<"FBRScenario", 'String'>
    readonly isActive: FieldRef<"FBRScenario", 'Boolean'>
    readonly registrationType: FieldRef<"FBRScenario", 'String'>
    readonly transactionType: FieldRef<"FBRScenario", 'String'>
    readonly taxRateApplicable: FieldRef<"FBRScenario", 'Float'>
    readonly specialConditions: FieldRef<"FBRScenario", 'String[]'>
    readonly provinceRestrictions: FieldRef<"FBRScenario", 'String[]'>
    readonly effectiveFrom: FieldRef<"FBRScenario", 'DateTime'>
    readonly effectiveTo: FieldRef<"FBRScenario", 'DateTime'>
    readonly priority: FieldRef<"FBRScenario", 'Int'>
    readonly saleType: FieldRef<"FBRScenario", 'String'>
    readonly createdAt: FieldRef<"FBRScenario", 'DateTime'>
    readonly updatedAt: FieldRef<"FBRScenario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FBRScenario findUnique
   */
  export type FBRScenarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter, which FBRScenario to fetch.
     */
    where: FBRScenarioWhereUniqueInput
  }

  /**
   * FBRScenario findUniqueOrThrow
   */
  export type FBRScenarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter, which FBRScenario to fetch.
     */
    where: FBRScenarioWhereUniqueInput
  }

  /**
   * FBRScenario findFirst
   */
  export type FBRScenarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter, which FBRScenario to fetch.
     */
    where?: FBRScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRScenarios to fetch.
     */
    orderBy?: FBRScenarioOrderByWithRelationInput | FBRScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBRScenarios.
     */
    cursor?: FBRScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBRScenarios.
     */
    distinct?: FBRScenarioScalarFieldEnum | FBRScenarioScalarFieldEnum[]
  }

  /**
   * FBRScenario findFirstOrThrow
   */
  export type FBRScenarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter, which FBRScenario to fetch.
     */
    where?: FBRScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRScenarios to fetch.
     */
    orderBy?: FBRScenarioOrderByWithRelationInput | FBRScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBRScenarios.
     */
    cursor?: FBRScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBRScenarios.
     */
    distinct?: FBRScenarioScalarFieldEnum | FBRScenarioScalarFieldEnum[]
  }

  /**
   * FBRScenario findMany
   */
  export type FBRScenarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter, which FBRScenarios to fetch.
     */
    where?: FBRScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRScenarios to fetch.
     */
    orderBy?: FBRScenarioOrderByWithRelationInput | FBRScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FBRScenarios.
     */
    cursor?: FBRScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRScenarios.
     */
    skip?: number
    distinct?: FBRScenarioScalarFieldEnum | FBRScenarioScalarFieldEnum[]
  }

  /**
   * FBRScenario create
   */
  export type FBRScenarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * The data needed to create a FBRScenario.
     */
    data: XOR<FBRScenarioCreateInput, FBRScenarioUncheckedCreateInput>
  }

  /**
   * FBRScenario createMany
   */
  export type FBRScenarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FBRScenarios.
     */
    data: FBRScenarioCreateManyInput | FBRScenarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FBRScenario createManyAndReturn
   */
  export type FBRScenarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FBRScenarios.
     */
    data: FBRScenarioCreateManyInput | FBRScenarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FBRScenario update
   */
  export type FBRScenarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * The data needed to update a FBRScenario.
     */
    data: XOR<FBRScenarioUpdateInput, FBRScenarioUncheckedUpdateInput>
    /**
     * Choose, which FBRScenario to update.
     */
    where: FBRScenarioWhereUniqueInput
  }

  /**
   * FBRScenario updateMany
   */
  export type FBRScenarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FBRScenarios.
     */
    data: XOR<FBRScenarioUpdateManyMutationInput, FBRScenarioUncheckedUpdateManyInput>
    /**
     * Filter which FBRScenarios to update
     */
    where?: FBRScenarioWhereInput
  }

  /**
   * FBRScenario upsert
   */
  export type FBRScenarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * The filter to search for the FBRScenario to update in case it exists.
     */
    where: FBRScenarioWhereUniqueInput
    /**
     * In case the FBRScenario found by the `where` argument doesn't exist, create a new FBRScenario with this data.
     */
    create: XOR<FBRScenarioCreateInput, FBRScenarioUncheckedCreateInput>
    /**
     * In case the FBRScenario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FBRScenarioUpdateInput, FBRScenarioUncheckedUpdateInput>
  }

  /**
   * FBRScenario delete
   */
  export type FBRScenarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
    /**
     * Filter which FBRScenario to delete.
     */
    where: FBRScenarioWhereUniqueInput
  }

  /**
   * FBRScenario deleteMany
   */
  export type FBRScenarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBRScenarios to delete
     */
    where?: FBRScenarioWhereInput
  }

  /**
   * FBRScenario without action
   */
  export type FBRScenarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRScenario
     */
    select?: FBRScenarioSelect<ExtArgs> | null
  }


  /**
   * Model FBRBusinessScenarioMapping
   */

  export type AggregateFBRBusinessScenarioMapping = {
    _count: FBRBusinessScenarioMappingCountAggregateOutputType | null
    _min: FBRBusinessScenarioMappingMinAggregateOutputType | null
    _max: FBRBusinessScenarioMappingMaxAggregateOutputType | null
  }

  export type FBRBusinessScenarioMappingMinAggregateOutputType = {
    id: string | null
    businessType: string | null
    industrySector: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FBRBusinessScenarioMappingMaxAggregateOutputType = {
    id: string | null
    businessType: string | null
    industrySector: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FBRBusinessScenarioMappingCountAggregateOutputType = {
    id: number
    businessType: number
    industrySector: number
    scenarioIds: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FBRBusinessScenarioMappingMinAggregateInputType = {
    id?: true
    businessType?: true
    industrySector?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FBRBusinessScenarioMappingMaxAggregateInputType = {
    id?: true
    businessType?: true
    industrySector?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FBRBusinessScenarioMappingCountAggregateInputType = {
    id?: true
    businessType?: true
    industrySector?: true
    scenarioIds?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FBRBusinessScenarioMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBRBusinessScenarioMapping to aggregate.
     */
    where?: FBRBusinessScenarioMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRBusinessScenarioMappings to fetch.
     */
    orderBy?: FBRBusinessScenarioMappingOrderByWithRelationInput | FBRBusinessScenarioMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FBRBusinessScenarioMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRBusinessScenarioMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRBusinessScenarioMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FBRBusinessScenarioMappings
    **/
    _count?: true | FBRBusinessScenarioMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FBRBusinessScenarioMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FBRBusinessScenarioMappingMaxAggregateInputType
  }

  export type GetFBRBusinessScenarioMappingAggregateType<T extends FBRBusinessScenarioMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateFBRBusinessScenarioMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFBRBusinessScenarioMapping[P]>
      : GetScalarType<T[P], AggregateFBRBusinessScenarioMapping[P]>
  }




  export type FBRBusinessScenarioMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FBRBusinessScenarioMappingWhereInput
    orderBy?: FBRBusinessScenarioMappingOrderByWithAggregationInput | FBRBusinessScenarioMappingOrderByWithAggregationInput[]
    by: FBRBusinessScenarioMappingScalarFieldEnum[] | FBRBusinessScenarioMappingScalarFieldEnum
    having?: FBRBusinessScenarioMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FBRBusinessScenarioMappingCountAggregateInputType | true
    _min?: FBRBusinessScenarioMappingMinAggregateInputType
    _max?: FBRBusinessScenarioMappingMaxAggregateInputType
  }

  export type FBRBusinessScenarioMappingGroupByOutputType = {
    id: string
    businessType: string
    industrySector: string
    scenarioIds: string[]
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: FBRBusinessScenarioMappingCountAggregateOutputType | null
    _min: FBRBusinessScenarioMappingMinAggregateOutputType | null
    _max: FBRBusinessScenarioMappingMaxAggregateOutputType | null
  }

  type GetFBRBusinessScenarioMappingGroupByPayload<T extends FBRBusinessScenarioMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FBRBusinessScenarioMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FBRBusinessScenarioMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FBRBusinessScenarioMappingGroupByOutputType[P]>
            : GetScalarType<T[P], FBRBusinessScenarioMappingGroupByOutputType[P]>
        }
      >
    >


  export type FBRBusinessScenarioMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessType?: boolean
    industrySector?: boolean
    scenarioIds?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fBRBusinessScenarioMapping"]>

  export type FBRBusinessScenarioMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessType?: boolean
    industrySector?: boolean
    scenarioIds?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fBRBusinessScenarioMapping"]>

  export type FBRBusinessScenarioMappingSelectScalar = {
    id?: boolean
    businessType?: boolean
    industrySector?: boolean
    scenarioIds?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $FBRBusinessScenarioMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FBRBusinessScenarioMapping"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessType: string
      industrySector: string
      scenarioIds: string[]
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fBRBusinessScenarioMapping"]>
    composites: {}
  }

  type FBRBusinessScenarioMappingGetPayload<S extends boolean | null | undefined | FBRBusinessScenarioMappingDefaultArgs> = $Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload, S>

  type FBRBusinessScenarioMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FBRBusinessScenarioMappingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FBRBusinessScenarioMappingCountAggregateInputType | true
    }

  export interface FBRBusinessScenarioMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FBRBusinessScenarioMapping'], meta: { name: 'FBRBusinessScenarioMapping' } }
    /**
     * Find zero or one FBRBusinessScenarioMapping that matches the filter.
     * @param {FBRBusinessScenarioMappingFindUniqueArgs} args - Arguments to find a FBRBusinessScenarioMapping
     * @example
     * // Get one FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FBRBusinessScenarioMappingFindUniqueArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingFindUniqueArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FBRBusinessScenarioMapping that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FBRBusinessScenarioMappingFindUniqueOrThrowArgs} args - Arguments to find a FBRBusinessScenarioMapping
     * @example
     * // Get one FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FBRBusinessScenarioMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FBRBusinessScenarioMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingFindFirstArgs} args - Arguments to find a FBRBusinessScenarioMapping
     * @example
     * // Get one FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FBRBusinessScenarioMappingFindFirstArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingFindFirstArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FBRBusinessScenarioMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingFindFirstOrThrowArgs} args - Arguments to find a FBRBusinessScenarioMapping
     * @example
     * // Get one FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FBRBusinessScenarioMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FBRBusinessScenarioMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FBRBusinessScenarioMappings
     * const fBRBusinessScenarioMappings = await prisma.fBRBusinessScenarioMapping.findMany()
     * 
     * // Get first 10 FBRBusinessScenarioMappings
     * const fBRBusinessScenarioMappings = await prisma.fBRBusinessScenarioMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fBRBusinessScenarioMappingWithIdOnly = await prisma.fBRBusinessScenarioMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FBRBusinessScenarioMappingFindManyArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FBRBusinessScenarioMapping.
     * @param {FBRBusinessScenarioMappingCreateArgs} args - Arguments to create a FBRBusinessScenarioMapping.
     * @example
     * // Create one FBRBusinessScenarioMapping
     * const FBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.create({
     *   data: {
     *     // ... data to create a FBRBusinessScenarioMapping
     *   }
     * })
     * 
     */
    create<T extends FBRBusinessScenarioMappingCreateArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingCreateArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FBRBusinessScenarioMappings.
     * @param {FBRBusinessScenarioMappingCreateManyArgs} args - Arguments to create many FBRBusinessScenarioMappings.
     * @example
     * // Create many FBRBusinessScenarioMappings
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FBRBusinessScenarioMappingCreateManyArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FBRBusinessScenarioMappings and returns the data saved in the database.
     * @param {FBRBusinessScenarioMappingCreateManyAndReturnArgs} args - Arguments to create many FBRBusinessScenarioMappings.
     * @example
     * // Create many FBRBusinessScenarioMappings
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FBRBusinessScenarioMappings and only return the `id`
     * const fBRBusinessScenarioMappingWithIdOnly = await prisma.fBRBusinessScenarioMapping.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FBRBusinessScenarioMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FBRBusinessScenarioMapping.
     * @param {FBRBusinessScenarioMappingDeleteArgs} args - Arguments to delete one FBRBusinessScenarioMapping.
     * @example
     * // Delete one FBRBusinessScenarioMapping
     * const FBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.delete({
     *   where: {
     *     // ... filter to delete one FBRBusinessScenarioMapping
     *   }
     * })
     * 
     */
    delete<T extends FBRBusinessScenarioMappingDeleteArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingDeleteArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FBRBusinessScenarioMapping.
     * @param {FBRBusinessScenarioMappingUpdateArgs} args - Arguments to update one FBRBusinessScenarioMapping.
     * @example
     * // Update one FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FBRBusinessScenarioMappingUpdateArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingUpdateArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FBRBusinessScenarioMappings.
     * @param {FBRBusinessScenarioMappingDeleteManyArgs} args - Arguments to filter FBRBusinessScenarioMappings to delete.
     * @example
     * // Delete a few FBRBusinessScenarioMappings
     * const { count } = await prisma.fBRBusinessScenarioMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FBRBusinessScenarioMappingDeleteManyArgs>(args?: SelectSubset<T, FBRBusinessScenarioMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FBRBusinessScenarioMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FBRBusinessScenarioMappings
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FBRBusinessScenarioMappingUpdateManyArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FBRBusinessScenarioMapping.
     * @param {FBRBusinessScenarioMappingUpsertArgs} args - Arguments to update or create a FBRBusinessScenarioMapping.
     * @example
     * // Update or create a FBRBusinessScenarioMapping
     * const fBRBusinessScenarioMapping = await prisma.fBRBusinessScenarioMapping.upsert({
     *   create: {
     *     // ... data to create a FBRBusinessScenarioMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FBRBusinessScenarioMapping we want to update
     *   }
     * })
     */
    upsert<T extends FBRBusinessScenarioMappingUpsertArgs>(args: SelectSubset<T, FBRBusinessScenarioMappingUpsertArgs<ExtArgs>>): Prisma__FBRBusinessScenarioMappingClient<$Result.GetResult<Prisma.$FBRBusinessScenarioMappingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FBRBusinessScenarioMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingCountArgs} args - Arguments to filter FBRBusinessScenarioMappings to count.
     * @example
     * // Count the number of FBRBusinessScenarioMappings
     * const count = await prisma.fBRBusinessScenarioMapping.count({
     *   where: {
     *     // ... the filter for the FBRBusinessScenarioMappings we want to count
     *   }
     * })
    **/
    count<T extends FBRBusinessScenarioMappingCountArgs>(
      args?: Subset<T, FBRBusinessScenarioMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FBRBusinessScenarioMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FBRBusinessScenarioMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FBRBusinessScenarioMappingAggregateArgs>(args: Subset<T, FBRBusinessScenarioMappingAggregateArgs>): Prisma.PrismaPromise<GetFBRBusinessScenarioMappingAggregateType<T>>

    /**
     * Group by FBRBusinessScenarioMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBRBusinessScenarioMappingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FBRBusinessScenarioMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FBRBusinessScenarioMappingGroupByArgs['orderBy'] }
        : { orderBy?: FBRBusinessScenarioMappingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FBRBusinessScenarioMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFBRBusinessScenarioMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FBRBusinessScenarioMapping model
   */
  readonly fields: FBRBusinessScenarioMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FBRBusinessScenarioMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FBRBusinessScenarioMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FBRBusinessScenarioMapping model
   */ 
  interface FBRBusinessScenarioMappingFieldRefs {
    readonly id: FieldRef<"FBRBusinessScenarioMapping", 'String'>
    readonly businessType: FieldRef<"FBRBusinessScenarioMapping", 'String'>
    readonly industrySector: FieldRef<"FBRBusinessScenarioMapping", 'String'>
    readonly scenarioIds: FieldRef<"FBRBusinessScenarioMapping", 'String[]'>
    readonly isActive: FieldRef<"FBRBusinessScenarioMapping", 'Boolean'>
    readonly createdAt: FieldRef<"FBRBusinessScenarioMapping", 'DateTime'>
    readonly updatedAt: FieldRef<"FBRBusinessScenarioMapping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FBRBusinessScenarioMapping findUnique
   */
  export type FBRBusinessScenarioMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter, which FBRBusinessScenarioMapping to fetch.
     */
    where: FBRBusinessScenarioMappingWhereUniqueInput
  }

  /**
   * FBRBusinessScenarioMapping findUniqueOrThrow
   */
  export type FBRBusinessScenarioMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter, which FBRBusinessScenarioMapping to fetch.
     */
    where: FBRBusinessScenarioMappingWhereUniqueInput
  }

  /**
   * FBRBusinessScenarioMapping findFirst
   */
  export type FBRBusinessScenarioMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter, which FBRBusinessScenarioMapping to fetch.
     */
    where?: FBRBusinessScenarioMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRBusinessScenarioMappings to fetch.
     */
    orderBy?: FBRBusinessScenarioMappingOrderByWithRelationInput | FBRBusinessScenarioMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBRBusinessScenarioMappings.
     */
    cursor?: FBRBusinessScenarioMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRBusinessScenarioMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRBusinessScenarioMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBRBusinessScenarioMappings.
     */
    distinct?: FBRBusinessScenarioMappingScalarFieldEnum | FBRBusinessScenarioMappingScalarFieldEnum[]
  }

  /**
   * FBRBusinessScenarioMapping findFirstOrThrow
   */
  export type FBRBusinessScenarioMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter, which FBRBusinessScenarioMapping to fetch.
     */
    where?: FBRBusinessScenarioMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRBusinessScenarioMappings to fetch.
     */
    orderBy?: FBRBusinessScenarioMappingOrderByWithRelationInput | FBRBusinessScenarioMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBRBusinessScenarioMappings.
     */
    cursor?: FBRBusinessScenarioMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRBusinessScenarioMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRBusinessScenarioMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBRBusinessScenarioMappings.
     */
    distinct?: FBRBusinessScenarioMappingScalarFieldEnum | FBRBusinessScenarioMappingScalarFieldEnum[]
  }

  /**
   * FBRBusinessScenarioMapping findMany
   */
  export type FBRBusinessScenarioMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter, which FBRBusinessScenarioMappings to fetch.
     */
    where?: FBRBusinessScenarioMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBRBusinessScenarioMappings to fetch.
     */
    orderBy?: FBRBusinessScenarioMappingOrderByWithRelationInput | FBRBusinessScenarioMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FBRBusinessScenarioMappings.
     */
    cursor?: FBRBusinessScenarioMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBRBusinessScenarioMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBRBusinessScenarioMappings.
     */
    skip?: number
    distinct?: FBRBusinessScenarioMappingScalarFieldEnum | FBRBusinessScenarioMappingScalarFieldEnum[]
  }

  /**
   * FBRBusinessScenarioMapping create
   */
  export type FBRBusinessScenarioMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * The data needed to create a FBRBusinessScenarioMapping.
     */
    data: XOR<FBRBusinessScenarioMappingCreateInput, FBRBusinessScenarioMappingUncheckedCreateInput>
  }

  /**
   * FBRBusinessScenarioMapping createMany
   */
  export type FBRBusinessScenarioMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FBRBusinessScenarioMappings.
     */
    data: FBRBusinessScenarioMappingCreateManyInput | FBRBusinessScenarioMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FBRBusinessScenarioMapping createManyAndReturn
   */
  export type FBRBusinessScenarioMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FBRBusinessScenarioMappings.
     */
    data: FBRBusinessScenarioMappingCreateManyInput | FBRBusinessScenarioMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FBRBusinessScenarioMapping update
   */
  export type FBRBusinessScenarioMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * The data needed to update a FBRBusinessScenarioMapping.
     */
    data: XOR<FBRBusinessScenarioMappingUpdateInput, FBRBusinessScenarioMappingUncheckedUpdateInput>
    /**
     * Choose, which FBRBusinessScenarioMapping to update.
     */
    where: FBRBusinessScenarioMappingWhereUniqueInput
  }

  /**
   * FBRBusinessScenarioMapping updateMany
   */
  export type FBRBusinessScenarioMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FBRBusinessScenarioMappings.
     */
    data: XOR<FBRBusinessScenarioMappingUpdateManyMutationInput, FBRBusinessScenarioMappingUncheckedUpdateManyInput>
    /**
     * Filter which FBRBusinessScenarioMappings to update
     */
    where?: FBRBusinessScenarioMappingWhereInput
  }

  /**
   * FBRBusinessScenarioMapping upsert
   */
  export type FBRBusinessScenarioMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * The filter to search for the FBRBusinessScenarioMapping to update in case it exists.
     */
    where: FBRBusinessScenarioMappingWhereUniqueInput
    /**
     * In case the FBRBusinessScenarioMapping found by the `where` argument doesn't exist, create a new FBRBusinessScenarioMapping with this data.
     */
    create: XOR<FBRBusinessScenarioMappingCreateInput, FBRBusinessScenarioMappingUncheckedCreateInput>
    /**
     * In case the FBRBusinessScenarioMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FBRBusinessScenarioMappingUpdateInput, FBRBusinessScenarioMappingUncheckedUpdateInput>
  }

  /**
   * FBRBusinessScenarioMapping delete
   */
  export type FBRBusinessScenarioMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
    /**
     * Filter which FBRBusinessScenarioMapping to delete.
     */
    where: FBRBusinessScenarioMappingWhereUniqueInput
  }

  /**
   * FBRBusinessScenarioMapping deleteMany
   */
  export type FBRBusinessScenarioMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBRBusinessScenarioMappings to delete
     */
    where?: FBRBusinessScenarioMappingWhereInput
  }

  /**
   * FBRBusinessScenarioMapping without action
   */
  export type FBRBusinessScenarioMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBRBusinessScenarioMapping
     */
    select?: FBRBusinessScenarioMappingSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLogin: 'lastLogin',
    subscriptionPlan: 'subscriptionPlan',
    subscriptionEnd: 'subscriptionEnd'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const BusinessScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    companyName: 'companyName',
    ntnNumber: 'ntnNumber',
    address: 'address',
    province: 'province',
    city: 'city',
    postalCode: 'postalCode',
    businessType: 'businessType',
    sector: 'sector',
    phoneNumber: 'phoneNumber',
    email: 'email',
    website: 'website',
    fbrSetupComplete: 'fbrSetupComplete',
    fbrSetupSkipped: 'fbrSetupSkipped',
    integrationMode: 'integrationMode',
    sandboxValidated: 'sandboxValidated',
    productionEnabled: 'productionEnabled',
    sandboxToken: 'sandboxToken',
    productionToken: 'productionToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BusinessScalarFieldEnum = (typeof BusinessScalarFieldEnum)[keyof typeof BusinessScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    name: 'name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    city: 'city',
    province: 'province',
    postalCode: 'postalCode',
    ntnNumber: 'ntnNumber',
    registrationType: 'registrationType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    customerId: 'customerId',
    localInvoiceNumber: 'localInvoiceNumber',
    invoiceSequence: 'invoiceSequence',
    invoiceDate: 'invoiceDate',
    dueDate: 'dueDate',
    description: 'description',
    notes: 'notes',
    subtotal: 'subtotal',
    taxAmount: 'taxAmount',
    totalAmount: 'totalAmount',
    discount: 'discount',
    status: 'status',
    mode: 'mode',
    fbrSubmitted: 'fbrSubmitted',
    fbrValidated: 'fbrValidated',
    submissionTimestamp: 'submissionTimestamp',
    fbrInvoiceNumber: 'fbrInvoiceNumber',
    locallyGeneratedQRCode: 'locallyGeneratedQRCode',
    fbrTimestamp: 'fbrTimestamp',
    fbrTransmissionId: 'fbrTransmissionId',
    fbrAcknowledgmentNumber: 'fbrAcknowledgmentNumber',
    fbrResponse: 'fbrResponse',
    pdfGenerated: 'pdfGenerated',
    pdfStoragePath: 'pdfStoragePath',
    encryptedData: 'encryptedData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const InvoiceItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    description: 'description',
    hsCode: 'hsCode',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    totalValue: 'totalValue',
    taxRate: 'taxRate',
    taxAmount: 'taxAmount',
    exemptionSRO: 'exemptionSRO',
    unitOfMeasurement: 'unitOfMeasurement'
  };

  export type InvoiceItemScalarFieldEnum = (typeof InvoiceItemScalarFieldEnum)[keyof typeof InvoiceItemScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    name: 'name',
    description: 'description',
    hsCode: 'hsCode',
    unitOfMeasurement: 'unitOfMeasurement',
    unitPrice: 'unitPrice',
    taxRate: 'taxRate',
    category: 'category',
    sku: 'sku',
    stock: 'stock',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const BulkInvoiceBatchScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    businessId: 'businessId',
    fileName: 'fileName',
    originalName: 'originalName',
    fileSize: 'fileSize',
    totalRecords: 'totalRecords',
    validRecords: 'validRecords',
    invalidRecords: 'invalidRecords',
    processingStatus: 'processingStatus',
    validationStatus: 'validationStatus',
    validationErrors: 'validationErrors',
    processingErrors: 'processingErrors',
    uploadedAt: 'uploadedAt',
    processedAt: 'processedAt',
    completedAt: 'completedAt'
  };

  export type BulkInvoiceBatchScalarFieldEnum = (typeof BulkInvoiceBatchScalarFieldEnum)[keyof typeof BulkInvoiceBatchScalarFieldEnum]


  export const BulkInvoiceItemScalarFieldEnum: {
    id: 'id',
    batchId: 'batchId',
    rowNumber: 'rowNumber',
    localId: 'localId',
    dataValid: 'dataValid',
    sandboxValidated: 'sandboxValidated',
    sandboxSubmitted: 'sandboxSubmitted',
    productionSubmitted: 'productionSubmitted',
    validationErrors: 'validationErrors',
    sandboxResponse: 'sandboxResponse',
    productionResponse: 'productionResponse',
    fbrInvoiceNumber: 'fbrInvoiceNumber',
    invoiceData: 'invoiceData',
    processedAt: 'processedAt'
  };

  export type BulkInvoiceItemScalarFieldEnum = (typeof BulkInvoiceItemScalarFieldEnum)[keyof typeof BulkInvoiceItemScalarFieldEnum]


  export const SystemConfigScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SystemConfigScalarFieldEnum = (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    businessId: 'businessId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    oldValues: 'oldValues',
    newValues: 'newValues',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const FBRScenarioScalarFieldEnum: {
    code: 'code',
    description: 'description',
    businessType: 'businessType',
    sector: 'sector',
    isActive: 'isActive',
    registrationType: 'registrationType',
    transactionType: 'transactionType',
    taxRateApplicable: 'taxRateApplicable',
    specialConditions: 'specialConditions',
    provinceRestrictions: 'provinceRestrictions',
    effectiveFrom: 'effectiveFrom',
    effectiveTo: 'effectiveTo',
    priority: 'priority',
    saleType: 'saleType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FBRScenarioScalarFieldEnum = (typeof FBRScenarioScalarFieldEnum)[keyof typeof FBRScenarioScalarFieldEnum]


  export const FBRBusinessScenarioMappingScalarFieldEnum: {
    id: 'id',
    businessType: 'businessType',
    industrySector: 'industrySector',
    scenarioIds: 'scenarioIds',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FBRBusinessScenarioMappingScalarFieldEnum = (typeof FBRBusinessScenarioMappingScalarFieldEnum)[keyof typeof FBRBusinessScenarioMappingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SubscriptionPlan'
   */
  export type EnumSubscriptionPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlan'>
    


  /**
   * Reference to a field of type 'SubscriptionPlan[]'
   */
  export type ListEnumSubscriptionPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlan[]'>
    


  /**
   * Reference to a field of type 'IntegrationMode'
   */
  export type EnumIntegrationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationMode'>
    


  /**
   * Reference to a field of type 'IntegrationMode[]'
   */
  export type ListEnumIntegrationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationMode[]'>
    


  /**
   * Reference to a field of type 'RegistrationType'
   */
  export type EnumRegistrationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RegistrationType'>
    


  /**
   * Reference to a field of type 'RegistrationType[]'
   */
  export type ListEnumRegistrationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RegistrationType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'InvoiceStatus'
   */
  export type EnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus'>
    


  /**
   * Reference to a field of type 'InvoiceStatus[]'
   */
  export type ListEnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ProcessingStatus'
   */
  export type EnumProcessingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingStatus'>
    


  /**
   * Reference to a field of type 'ProcessingStatus[]'
   */
  export type ListEnumProcessingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingStatus[]'>
    


  /**
   * Reference to a field of type 'ValidationStatus'
   */
  export type EnumValidationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ValidationStatus'>
    


  /**
   * Reference to a field of type 'ValidationStatus[]'
   */
  export type ListEnumValidationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ValidationStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFilter<"User"> | $Enums.SubscriptionPlan
    subscriptionEnd?: DateTimeNullableFilter<"User"> | Date | string | null
    businesses?: BusinessListRelationFilter
    sessions?: UserSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    subscriptionPlan?: SortOrder
    subscriptionEnd?: SortOrderInput | SortOrder
    businesses?: BusinessOrderByRelationAggregateInput
    sessions?: UserSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFilter<"User"> | $Enums.SubscriptionPlan
    subscriptionEnd?: DateTimeNullableFilter<"User"> | Date | string | null
    businesses?: BusinessListRelationFilter
    sessions?: UserSessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    subscriptionPlan?: SortOrder
    subscriptionEnd?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanWithAggregatesFilter<"User"> | $Enums.SubscriptionPlan
    subscriptionEnd?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    token?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSession"> | string
    userId?: StringWithAggregatesFilter<"UserSession"> | string
    token?: StringWithAggregatesFilter<"UserSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
  }

  export type BusinessWhereInput = {
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    id?: StringFilter<"Business"> | string
    userId?: StringFilter<"Business"> | string
    companyName?: StringFilter<"Business"> | string
    ntnNumber?: StringFilter<"Business"> | string
    address?: StringFilter<"Business"> | string
    province?: StringFilter<"Business"> | string
    city?: StringNullableFilter<"Business"> | string | null
    postalCode?: StringNullableFilter<"Business"> | string | null
    businessType?: StringFilter<"Business"> | string
    sector?: StringFilter<"Business"> | string
    phoneNumber?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    website?: StringNullableFilter<"Business"> | string | null
    fbrSetupComplete?: BoolFilter<"Business"> | boolean
    fbrSetupSkipped?: BoolFilter<"Business"> | boolean
    integrationMode?: EnumIntegrationModeFilter<"Business"> | $Enums.IntegrationMode
    sandboxValidated?: BoolFilter<"Business"> | boolean
    productionEnabled?: BoolFilter<"Business"> | boolean
    sandboxToken?: StringNullableFilter<"Business"> | string | null
    productionToken?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    invoices?: InvoiceListRelationFilter
    customers?: CustomerListRelationFilter
    products?: ProductListRelationFilter
  }

  export type BusinessOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    ntnNumber?: SortOrder
    address?: SortOrder
    province?: SortOrder
    city?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    fbrSetupComplete?: SortOrder
    fbrSetupSkipped?: SortOrder
    integrationMode?: SortOrder
    sandboxValidated?: SortOrder
    productionEnabled?: SortOrder
    sandboxToken?: SortOrderInput | SortOrder
    productionToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    invoices?: InvoiceOrderByRelationAggregateInput
    customers?: CustomerOrderByRelationAggregateInput
    products?: ProductOrderByRelationAggregateInput
  }

  export type BusinessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ntnNumber?: string
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    userId?: StringFilter<"Business"> | string
    companyName?: StringFilter<"Business"> | string
    address?: StringFilter<"Business"> | string
    province?: StringFilter<"Business"> | string
    city?: StringNullableFilter<"Business"> | string | null
    postalCode?: StringNullableFilter<"Business"> | string | null
    businessType?: StringFilter<"Business"> | string
    sector?: StringFilter<"Business"> | string
    phoneNumber?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    website?: StringNullableFilter<"Business"> | string | null
    fbrSetupComplete?: BoolFilter<"Business"> | boolean
    fbrSetupSkipped?: BoolFilter<"Business"> | boolean
    integrationMode?: EnumIntegrationModeFilter<"Business"> | $Enums.IntegrationMode
    sandboxValidated?: BoolFilter<"Business"> | boolean
    productionEnabled?: BoolFilter<"Business"> | boolean
    sandboxToken?: StringNullableFilter<"Business"> | string | null
    productionToken?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    invoices?: InvoiceListRelationFilter
    customers?: CustomerListRelationFilter
    products?: ProductListRelationFilter
  }, "id" | "ntnNumber">

  export type BusinessOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    ntnNumber?: SortOrder
    address?: SortOrder
    province?: SortOrder
    city?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    fbrSetupComplete?: SortOrder
    fbrSetupSkipped?: SortOrder
    integrationMode?: SortOrder
    sandboxValidated?: SortOrder
    productionEnabled?: SortOrder
    sandboxToken?: SortOrderInput | SortOrder
    productionToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BusinessCountOrderByAggregateInput
    _max?: BusinessMaxOrderByAggregateInput
    _min?: BusinessMinOrderByAggregateInput
  }

  export type BusinessScalarWhereWithAggregatesInput = {
    AND?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    OR?: BusinessScalarWhereWithAggregatesInput[]
    NOT?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Business"> | string
    userId?: StringWithAggregatesFilter<"Business"> | string
    companyName?: StringWithAggregatesFilter<"Business"> | string
    ntnNumber?: StringWithAggregatesFilter<"Business"> | string
    address?: StringWithAggregatesFilter<"Business"> | string
    province?: StringWithAggregatesFilter<"Business"> | string
    city?: StringNullableWithAggregatesFilter<"Business"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"Business"> | string | null
    businessType?: StringWithAggregatesFilter<"Business"> | string
    sector?: StringWithAggregatesFilter<"Business"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"Business"> | string | null
    email?: StringNullableWithAggregatesFilter<"Business"> | string | null
    website?: StringNullableWithAggregatesFilter<"Business"> | string | null
    fbrSetupComplete?: BoolWithAggregatesFilter<"Business"> | boolean
    fbrSetupSkipped?: BoolWithAggregatesFilter<"Business"> | boolean
    integrationMode?: EnumIntegrationModeWithAggregatesFilter<"Business"> | $Enums.IntegrationMode
    sandboxValidated?: BoolWithAggregatesFilter<"Business"> | boolean
    productionEnabled?: BoolWithAggregatesFilter<"Business"> | boolean
    sandboxToken?: StringNullableWithAggregatesFilter<"Business"> | string | null
    productionToken?: StringNullableWithAggregatesFilter<"Business"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    businessId?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    province?: StringNullableFilter<"Customer"> | string | null
    postalCode?: StringNullableFilter<"Customer"> | string | null
    ntnNumber?: StringNullableFilter<"Customer"> | string | null
    registrationType?: EnumRegistrationTypeFilter<"Customer"> | $Enums.RegistrationType
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    invoices?: InvoiceListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    ntnNumber?: SortOrderInput | SortOrder
    registrationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    invoices?: InvoiceOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    businessId?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    province?: StringNullableFilter<"Customer"> | string | null
    postalCode?: StringNullableFilter<"Customer"> | string | null
    ntnNumber?: StringNullableFilter<"Customer"> | string | null
    registrationType?: EnumRegistrationTypeFilter<"Customer"> | $Enums.RegistrationType
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    invoices?: InvoiceListRelationFilter
  }, "id">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    ntnNumber?: SortOrderInput | SortOrder
    registrationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    businessId?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    city?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    province?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    ntnNumber?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    registrationType?: EnumRegistrationTypeWithAggregatesFilter<"Customer"> | $Enums.RegistrationType
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    businessId?: StringFilter<"Invoice"> | string
    customerId?: StringNullableFilter<"Invoice"> | string | null
    localInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    invoiceSequence?: IntFilter<"Invoice"> | number
    invoiceDate?: StringFilter<"Invoice"> | string
    dueDate?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    subtotal?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    totalAmount?: FloatFilter<"Invoice"> | number
    discount?: FloatFilter<"Invoice"> | number
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFilter<"Invoice"> | $Enums.IntegrationMode
    fbrSubmitted?: BoolFilter<"Invoice"> | boolean
    fbrValidated?: BoolFilter<"Invoice"> | boolean
    submissionTimestamp?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    fbrInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    locallyGeneratedQRCode?: StringNullableFilter<"Invoice"> | string | null
    fbrTimestamp?: StringNullableFilter<"Invoice"> | string | null
    fbrTransmissionId?: StringNullableFilter<"Invoice"> | string | null
    fbrAcknowledgmentNumber?: StringNullableFilter<"Invoice"> | string | null
    fbrResponse?: JsonNullableFilter<"Invoice">
    pdfGenerated?: BoolFilter<"Invoice"> | boolean
    pdfStoragePath?: StringNullableFilter<"Invoice"> | string | null
    encryptedData?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    items?: InvoiceItemListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    localInvoiceNumber?: SortOrderInput | SortOrder
    invoiceSequence?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
    status?: SortOrder
    mode?: SortOrder
    fbrSubmitted?: SortOrder
    fbrValidated?: SortOrder
    submissionTimestamp?: SortOrderInput | SortOrder
    fbrInvoiceNumber?: SortOrderInput | SortOrder
    locallyGeneratedQRCode?: SortOrderInput | SortOrder
    fbrTimestamp?: SortOrderInput | SortOrder
    fbrTransmissionId?: SortOrderInput | SortOrder
    fbrAcknowledgmentNumber?: SortOrderInput | SortOrder
    fbrResponse?: SortOrderInput | SortOrder
    pdfGenerated?: SortOrder
    pdfStoragePath?: SortOrderInput | SortOrder
    encryptedData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    items?: InvoiceItemOrderByRelationAggregateInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessId_invoiceSequence?: InvoiceBusinessIdInvoiceSequenceCompoundUniqueInput
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    businessId?: StringFilter<"Invoice"> | string
    customerId?: StringNullableFilter<"Invoice"> | string | null
    localInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    invoiceSequence?: IntFilter<"Invoice"> | number
    invoiceDate?: StringFilter<"Invoice"> | string
    dueDate?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    subtotal?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    totalAmount?: FloatFilter<"Invoice"> | number
    discount?: FloatFilter<"Invoice"> | number
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFilter<"Invoice"> | $Enums.IntegrationMode
    fbrSubmitted?: BoolFilter<"Invoice"> | boolean
    fbrValidated?: BoolFilter<"Invoice"> | boolean
    submissionTimestamp?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    fbrInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    locallyGeneratedQRCode?: StringNullableFilter<"Invoice"> | string | null
    fbrTimestamp?: StringNullableFilter<"Invoice"> | string | null
    fbrTransmissionId?: StringNullableFilter<"Invoice"> | string | null
    fbrAcknowledgmentNumber?: StringNullableFilter<"Invoice"> | string | null
    fbrResponse?: JsonNullableFilter<"Invoice">
    pdfGenerated?: BoolFilter<"Invoice"> | boolean
    pdfStoragePath?: StringNullableFilter<"Invoice"> | string | null
    encryptedData?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    items?: InvoiceItemListRelationFilter
  }, "id" | "businessId_invoiceSequence">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    localInvoiceNumber?: SortOrderInput | SortOrder
    invoiceSequence?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
    status?: SortOrder
    mode?: SortOrder
    fbrSubmitted?: SortOrder
    fbrValidated?: SortOrder
    submissionTimestamp?: SortOrderInput | SortOrder
    fbrInvoiceNumber?: SortOrderInput | SortOrder
    locallyGeneratedQRCode?: SortOrderInput | SortOrder
    fbrTimestamp?: SortOrderInput | SortOrder
    fbrTransmissionId?: SortOrderInput | SortOrder
    fbrAcknowledgmentNumber?: SortOrderInput | SortOrder
    fbrResponse?: SortOrderInput | SortOrder
    pdfGenerated?: SortOrder
    pdfStoragePath?: SortOrderInput | SortOrder
    encryptedData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    businessId?: StringWithAggregatesFilter<"Invoice"> | string
    customerId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    localInvoiceNumber?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    invoiceSequence?: IntWithAggregatesFilter<"Invoice"> | number
    invoiceDate?: StringWithAggregatesFilter<"Invoice"> | string
    dueDate?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    description?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    subtotal?: FloatWithAggregatesFilter<"Invoice"> | number
    taxAmount?: FloatWithAggregatesFilter<"Invoice"> | number
    totalAmount?: FloatWithAggregatesFilter<"Invoice"> | number
    discount?: FloatWithAggregatesFilter<"Invoice"> | number
    status?: EnumInvoiceStatusWithAggregatesFilter<"Invoice"> | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeWithAggregatesFilter<"Invoice"> | $Enums.IntegrationMode
    fbrSubmitted?: BoolWithAggregatesFilter<"Invoice"> | boolean
    fbrValidated?: BoolWithAggregatesFilter<"Invoice"> | boolean
    submissionTimestamp?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    fbrInvoiceNumber?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    locallyGeneratedQRCode?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    fbrTimestamp?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    fbrTransmissionId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    fbrAcknowledgmentNumber?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    fbrResponse?: JsonNullableWithAggregatesFilter<"Invoice">
    pdfGenerated?: BoolWithAggregatesFilter<"Invoice"> | boolean
    pdfStoragePath?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    encryptedData?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type InvoiceItemWhereInput = {
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    hsCode?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    totalValue?: FloatFilter<"InvoiceItem"> | number
    taxRate?: FloatFilter<"InvoiceItem"> | number
    taxAmount?: FloatFilter<"InvoiceItem"> | number
    exemptionSRO?: StringNullableFilter<"InvoiceItem"> | string | null
    unitOfMeasurement?: StringFilter<"InvoiceItem"> | string
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
  }

  export type InvoiceItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    exemptionSRO?: SortOrderInput | SortOrder
    unitOfMeasurement?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type InvoiceItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    hsCode?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    totalValue?: FloatFilter<"InvoiceItem"> | number
    taxRate?: FloatFilter<"InvoiceItem"> | number
    taxAmount?: FloatFilter<"InvoiceItem"> | number
    exemptionSRO?: StringNullableFilter<"InvoiceItem"> | string | null
    unitOfMeasurement?: StringFilter<"InvoiceItem"> | string
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
  }, "id">

  export type InvoiceItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    exemptionSRO?: SortOrderInput | SortOrder
    unitOfMeasurement?: SortOrder
    _count?: InvoiceItemCountOrderByAggregateInput
    _avg?: InvoiceItemAvgOrderByAggregateInput
    _max?: InvoiceItemMaxOrderByAggregateInput
    _min?: InvoiceItemMinOrderByAggregateInput
    _sum?: InvoiceItemSumOrderByAggregateInput
  }

  export type InvoiceItemScalarWhereWithAggregatesInput = {
    AND?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    OR?: InvoiceItemScalarWhereWithAggregatesInput[]
    NOT?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceItem"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceItem"> | string
    description?: StringWithAggregatesFilter<"InvoiceItem"> | string
    hsCode?: StringWithAggregatesFilter<"InvoiceItem"> | string
    quantity?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    totalValue?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    taxRate?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    taxAmount?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    exemptionSRO?: StringNullableWithAggregatesFilter<"InvoiceItem"> | string | null
    unitOfMeasurement?: StringWithAggregatesFilter<"InvoiceItem"> | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    businessId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    hsCode?: StringFilter<"Product"> | string
    unitOfMeasurement?: StringFilter<"Product"> | string
    unitPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    taxRate?: IntFilter<"Product"> | number
    category?: StringNullableFilter<"Product"> | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    stock?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    hsCode?: SortOrder
    unitOfMeasurement?: SortOrder
    unitPrice?: SortOrder
    taxRate?: SortOrder
    category?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    stock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    businessId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    hsCode?: StringFilter<"Product"> | string
    unitOfMeasurement?: StringFilter<"Product"> | string
    unitPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    taxRate?: IntFilter<"Product"> | number
    category?: StringNullableFilter<"Product"> | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    stock?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    hsCode?: SortOrder
    unitOfMeasurement?: SortOrder
    unitPrice?: SortOrder
    taxRate?: SortOrder
    category?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    stock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    businessId?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    hsCode?: StringWithAggregatesFilter<"Product"> | string
    unitOfMeasurement?: StringWithAggregatesFilter<"Product"> | string
    unitPrice?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    taxRate?: IntWithAggregatesFilter<"Product"> | number
    category?: StringNullableWithAggregatesFilter<"Product"> | string | null
    sku?: StringNullableWithAggregatesFilter<"Product"> | string | null
    stock?: IntNullableWithAggregatesFilter<"Product"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type BulkInvoiceBatchWhereInput = {
    AND?: BulkInvoiceBatchWhereInput | BulkInvoiceBatchWhereInput[]
    OR?: BulkInvoiceBatchWhereInput[]
    NOT?: BulkInvoiceBatchWhereInput | BulkInvoiceBatchWhereInput[]
    id?: StringFilter<"BulkInvoiceBatch"> | string
    userId?: StringFilter<"BulkInvoiceBatch"> | string
    businessId?: StringFilter<"BulkInvoiceBatch"> | string
    fileName?: StringFilter<"BulkInvoiceBatch"> | string
    originalName?: StringFilter<"BulkInvoiceBatch"> | string
    fileSize?: IntFilter<"BulkInvoiceBatch"> | number
    totalRecords?: IntFilter<"BulkInvoiceBatch"> | number
    validRecords?: IntFilter<"BulkInvoiceBatch"> | number
    invalidRecords?: IntFilter<"BulkInvoiceBatch"> | number
    processingStatus?: EnumProcessingStatusFilter<"BulkInvoiceBatch"> | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFilter<"BulkInvoiceBatch"> | $Enums.ValidationStatus
    validationErrors?: JsonNullableFilter<"BulkInvoiceBatch">
    processingErrors?: JsonNullableFilter<"BulkInvoiceBatch">
    uploadedAt?: DateTimeFilter<"BulkInvoiceBatch"> | Date | string
    processedAt?: DateTimeNullableFilter<"BulkInvoiceBatch"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"BulkInvoiceBatch"> | Date | string | null
    items?: BulkInvoiceItemListRelationFilter
  }

  export type BulkInvoiceBatchOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
    processingStatus?: SortOrder
    validationStatus?: SortOrder
    validationErrors?: SortOrderInput | SortOrder
    processingErrors?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    items?: BulkInvoiceItemOrderByRelationAggregateInput
  }

  export type BulkInvoiceBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BulkInvoiceBatchWhereInput | BulkInvoiceBatchWhereInput[]
    OR?: BulkInvoiceBatchWhereInput[]
    NOT?: BulkInvoiceBatchWhereInput | BulkInvoiceBatchWhereInput[]
    userId?: StringFilter<"BulkInvoiceBatch"> | string
    businessId?: StringFilter<"BulkInvoiceBatch"> | string
    fileName?: StringFilter<"BulkInvoiceBatch"> | string
    originalName?: StringFilter<"BulkInvoiceBatch"> | string
    fileSize?: IntFilter<"BulkInvoiceBatch"> | number
    totalRecords?: IntFilter<"BulkInvoiceBatch"> | number
    validRecords?: IntFilter<"BulkInvoiceBatch"> | number
    invalidRecords?: IntFilter<"BulkInvoiceBatch"> | number
    processingStatus?: EnumProcessingStatusFilter<"BulkInvoiceBatch"> | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFilter<"BulkInvoiceBatch"> | $Enums.ValidationStatus
    validationErrors?: JsonNullableFilter<"BulkInvoiceBatch">
    processingErrors?: JsonNullableFilter<"BulkInvoiceBatch">
    uploadedAt?: DateTimeFilter<"BulkInvoiceBatch"> | Date | string
    processedAt?: DateTimeNullableFilter<"BulkInvoiceBatch"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"BulkInvoiceBatch"> | Date | string | null
    items?: BulkInvoiceItemListRelationFilter
  }, "id">

  export type BulkInvoiceBatchOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
    processingStatus?: SortOrder
    validationStatus?: SortOrder
    validationErrors?: SortOrderInput | SortOrder
    processingErrors?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: BulkInvoiceBatchCountOrderByAggregateInput
    _avg?: BulkInvoiceBatchAvgOrderByAggregateInput
    _max?: BulkInvoiceBatchMaxOrderByAggregateInput
    _min?: BulkInvoiceBatchMinOrderByAggregateInput
    _sum?: BulkInvoiceBatchSumOrderByAggregateInput
  }

  export type BulkInvoiceBatchScalarWhereWithAggregatesInput = {
    AND?: BulkInvoiceBatchScalarWhereWithAggregatesInput | BulkInvoiceBatchScalarWhereWithAggregatesInput[]
    OR?: BulkInvoiceBatchScalarWhereWithAggregatesInput[]
    NOT?: BulkInvoiceBatchScalarWhereWithAggregatesInput | BulkInvoiceBatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BulkInvoiceBatch"> | string
    userId?: StringWithAggregatesFilter<"BulkInvoiceBatch"> | string
    businessId?: StringWithAggregatesFilter<"BulkInvoiceBatch"> | string
    fileName?: StringWithAggregatesFilter<"BulkInvoiceBatch"> | string
    originalName?: StringWithAggregatesFilter<"BulkInvoiceBatch"> | string
    fileSize?: IntWithAggregatesFilter<"BulkInvoiceBatch"> | number
    totalRecords?: IntWithAggregatesFilter<"BulkInvoiceBatch"> | number
    validRecords?: IntWithAggregatesFilter<"BulkInvoiceBatch"> | number
    invalidRecords?: IntWithAggregatesFilter<"BulkInvoiceBatch"> | number
    processingStatus?: EnumProcessingStatusWithAggregatesFilter<"BulkInvoiceBatch"> | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusWithAggregatesFilter<"BulkInvoiceBatch"> | $Enums.ValidationStatus
    validationErrors?: JsonNullableWithAggregatesFilter<"BulkInvoiceBatch">
    processingErrors?: JsonNullableWithAggregatesFilter<"BulkInvoiceBatch">
    uploadedAt?: DateTimeWithAggregatesFilter<"BulkInvoiceBatch"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"BulkInvoiceBatch"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"BulkInvoiceBatch"> | Date | string | null
  }

  export type BulkInvoiceItemWhereInput = {
    AND?: BulkInvoiceItemWhereInput | BulkInvoiceItemWhereInput[]
    OR?: BulkInvoiceItemWhereInput[]
    NOT?: BulkInvoiceItemWhereInput | BulkInvoiceItemWhereInput[]
    id?: StringFilter<"BulkInvoiceItem"> | string
    batchId?: StringFilter<"BulkInvoiceItem"> | string
    rowNumber?: IntFilter<"BulkInvoiceItem"> | number
    localId?: StringFilter<"BulkInvoiceItem"> | string
    dataValid?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxValidated?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    productionSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    validationErrors?: JsonNullableFilter<"BulkInvoiceItem">
    sandboxResponse?: JsonNullableFilter<"BulkInvoiceItem">
    productionResponse?: JsonNullableFilter<"BulkInvoiceItem">
    fbrInvoiceNumber?: StringNullableFilter<"BulkInvoiceItem"> | string | null
    invoiceData?: JsonFilter<"BulkInvoiceItem">
    processedAt?: DateTimeNullableFilter<"BulkInvoiceItem"> | Date | string | null
    batch?: XOR<BulkInvoiceBatchRelationFilter, BulkInvoiceBatchWhereInput>
  }

  export type BulkInvoiceItemOrderByWithRelationInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    localId?: SortOrder
    dataValid?: SortOrder
    sandboxValidated?: SortOrder
    sandboxSubmitted?: SortOrder
    productionSubmitted?: SortOrder
    validationErrors?: SortOrderInput | SortOrder
    sandboxResponse?: SortOrderInput | SortOrder
    productionResponse?: SortOrderInput | SortOrder
    fbrInvoiceNumber?: SortOrderInput | SortOrder
    invoiceData?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    batch?: BulkInvoiceBatchOrderByWithRelationInput
  }

  export type BulkInvoiceItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BulkInvoiceItemWhereInput | BulkInvoiceItemWhereInput[]
    OR?: BulkInvoiceItemWhereInput[]
    NOT?: BulkInvoiceItemWhereInput | BulkInvoiceItemWhereInput[]
    batchId?: StringFilter<"BulkInvoiceItem"> | string
    rowNumber?: IntFilter<"BulkInvoiceItem"> | number
    localId?: StringFilter<"BulkInvoiceItem"> | string
    dataValid?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxValidated?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    productionSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    validationErrors?: JsonNullableFilter<"BulkInvoiceItem">
    sandboxResponse?: JsonNullableFilter<"BulkInvoiceItem">
    productionResponse?: JsonNullableFilter<"BulkInvoiceItem">
    fbrInvoiceNumber?: StringNullableFilter<"BulkInvoiceItem"> | string | null
    invoiceData?: JsonFilter<"BulkInvoiceItem">
    processedAt?: DateTimeNullableFilter<"BulkInvoiceItem"> | Date | string | null
    batch?: XOR<BulkInvoiceBatchRelationFilter, BulkInvoiceBatchWhereInput>
  }, "id">

  export type BulkInvoiceItemOrderByWithAggregationInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    localId?: SortOrder
    dataValid?: SortOrder
    sandboxValidated?: SortOrder
    sandboxSubmitted?: SortOrder
    productionSubmitted?: SortOrder
    validationErrors?: SortOrderInput | SortOrder
    sandboxResponse?: SortOrderInput | SortOrder
    productionResponse?: SortOrderInput | SortOrder
    fbrInvoiceNumber?: SortOrderInput | SortOrder
    invoiceData?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    _count?: BulkInvoiceItemCountOrderByAggregateInput
    _avg?: BulkInvoiceItemAvgOrderByAggregateInput
    _max?: BulkInvoiceItemMaxOrderByAggregateInput
    _min?: BulkInvoiceItemMinOrderByAggregateInput
    _sum?: BulkInvoiceItemSumOrderByAggregateInput
  }

  export type BulkInvoiceItemScalarWhereWithAggregatesInput = {
    AND?: BulkInvoiceItemScalarWhereWithAggregatesInput | BulkInvoiceItemScalarWhereWithAggregatesInput[]
    OR?: BulkInvoiceItemScalarWhereWithAggregatesInput[]
    NOT?: BulkInvoiceItemScalarWhereWithAggregatesInput | BulkInvoiceItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BulkInvoiceItem"> | string
    batchId?: StringWithAggregatesFilter<"BulkInvoiceItem"> | string
    rowNumber?: IntWithAggregatesFilter<"BulkInvoiceItem"> | number
    localId?: StringWithAggregatesFilter<"BulkInvoiceItem"> | string
    dataValid?: BoolWithAggregatesFilter<"BulkInvoiceItem"> | boolean
    sandboxValidated?: BoolWithAggregatesFilter<"BulkInvoiceItem"> | boolean
    sandboxSubmitted?: BoolWithAggregatesFilter<"BulkInvoiceItem"> | boolean
    productionSubmitted?: BoolWithAggregatesFilter<"BulkInvoiceItem"> | boolean
    validationErrors?: JsonNullableWithAggregatesFilter<"BulkInvoiceItem">
    sandboxResponse?: JsonNullableWithAggregatesFilter<"BulkInvoiceItem">
    productionResponse?: JsonNullableWithAggregatesFilter<"BulkInvoiceItem">
    fbrInvoiceNumber?: StringNullableWithAggregatesFilter<"BulkInvoiceItem"> | string | null
    invoiceData?: JsonWithAggregatesFilter<"BulkInvoiceItem">
    processedAt?: DateTimeNullableWithAggregatesFilter<"BulkInvoiceItem"> | Date | string | null
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    id?: StringFilter<"SystemConfig"> | string
    key?: StringFilter<"SystemConfig"> | string
    value?: StringFilter<"SystemConfig"> | string
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }

  export type SystemConfigOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    value?: StringFilter<"SystemConfig"> | string
    createdAt?: DateTimeFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }, "id" | "key">

  export type SystemConfigOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemConfig"> | string
    key?: StringWithAggregatesFilter<"SystemConfig"> | string
    value?: StringWithAggregatesFilter<"SystemConfig"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    businessId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    businessId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringNullableFilter<"AuditLog"> | string | null
    businessId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    businessId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    businessId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    newValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type FBRScenarioWhereInput = {
    AND?: FBRScenarioWhereInput | FBRScenarioWhereInput[]
    OR?: FBRScenarioWhereInput[]
    NOT?: FBRScenarioWhereInput | FBRScenarioWhereInput[]
    code?: StringFilter<"FBRScenario"> | string
    description?: StringFilter<"FBRScenario"> | string
    businessType?: StringNullableFilter<"FBRScenario"> | string | null
    sector?: StringNullableFilter<"FBRScenario"> | string | null
    isActive?: BoolFilter<"FBRScenario"> | boolean
    registrationType?: StringNullableFilter<"FBRScenario"> | string | null
    transactionType?: StringNullableFilter<"FBRScenario"> | string | null
    taxRateApplicable?: FloatNullableFilter<"FBRScenario"> | number | null
    specialConditions?: StringNullableListFilter<"FBRScenario">
    provinceRestrictions?: StringNullableListFilter<"FBRScenario">
    effectiveFrom?: DateTimeNullableFilter<"FBRScenario"> | Date | string | null
    effectiveTo?: DateTimeNullableFilter<"FBRScenario"> | Date | string | null
    priority?: IntNullableFilter<"FBRScenario"> | number | null
    saleType?: StringNullableFilter<"FBRScenario"> | string | null
    createdAt?: DateTimeFilter<"FBRScenario"> | Date | string
    updatedAt?: DateTimeFilter<"FBRScenario"> | Date | string
  }

  export type FBRScenarioOrderByWithRelationInput = {
    code?: SortOrder
    description?: SortOrder
    businessType?: SortOrderInput | SortOrder
    sector?: SortOrderInput | SortOrder
    isActive?: SortOrder
    registrationType?: SortOrderInput | SortOrder
    transactionType?: SortOrderInput | SortOrder
    taxRateApplicable?: SortOrderInput | SortOrder
    specialConditions?: SortOrder
    provinceRestrictions?: SortOrder
    effectiveFrom?: SortOrderInput | SortOrder
    effectiveTo?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    saleType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRScenarioWhereUniqueInput = Prisma.AtLeast<{
    code?: string
    AND?: FBRScenarioWhereInput | FBRScenarioWhereInput[]
    OR?: FBRScenarioWhereInput[]
    NOT?: FBRScenarioWhereInput | FBRScenarioWhereInput[]
    description?: StringFilter<"FBRScenario"> | string
    businessType?: StringNullableFilter<"FBRScenario"> | string | null
    sector?: StringNullableFilter<"FBRScenario"> | string | null
    isActive?: BoolFilter<"FBRScenario"> | boolean
    registrationType?: StringNullableFilter<"FBRScenario"> | string | null
    transactionType?: StringNullableFilter<"FBRScenario"> | string | null
    taxRateApplicable?: FloatNullableFilter<"FBRScenario"> | number | null
    specialConditions?: StringNullableListFilter<"FBRScenario">
    provinceRestrictions?: StringNullableListFilter<"FBRScenario">
    effectiveFrom?: DateTimeNullableFilter<"FBRScenario"> | Date | string | null
    effectiveTo?: DateTimeNullableFilter<"FBRScenario"> | Date | string | null
    priority?: IntNullableFilter<"FBRScenario"> | number | null
    saleType?: StringNullableFilter<"FBRScenario"> | string | null
    createdAt?: DateTimeFilter<"FBRScenario"> | Date | string
    updatedAt?: DateTimeFilter<"FBRScenario"> | Date | string
  }, "code">

  export type FBRScenarioOrderByWithAggregationInput = {
    code?: SortOrder
    description?: SortOrder
    businessType?: SortOrderInput | SortOrder
    sector?: SortOrderInput | SortOrder
    isActive?: SortOrder
    registrationType?: SortOrderInput | SortOrder
    transactionType?: SortOrderInput | SortOrder
    taxRateApplicable?: SortOrderInput | SortOrder
    specialConditions?: SortOrder
    provinceRestrictions?: SortOrder
    effectiveFrom?: SortOrderInput | SortOrder
    effectiveTo?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    saleType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FBRScenarioCountOrderByAggregateInput
    _avg?: FBRScenarioAvgOrderByAggregateInput
    _max?: FBRScenarioMaxOrderByAggregateInput
    _min?: FBRScenarioMinOrderByAggregateInput
    _sum?: FBRScenarioSumOrderByAggregateInput
  }

  export type FBRScenarioScalarWhereWithAggregatesInput = {
    AND?: FBRScenarioScalarWhereWithAggregatesInput | FBRScenarioScalarWhereWithAggregatesInput[]
    OR?: FBRScenarioScalarWhereWithAggregatesInput[]
    NOT?: FBRScenarioScalarWhereWithAggregatesInput | FBRScenarioScalarWhereWithAggregatesInput[]
    code?: StringWithAggregatesFilter<"FBRScenario"> | string
    description?: StringWithAggregatesFilter<"FBRScenario"> | string
    businessType?: StringNullableWithAggregatesFilter<"FBRScenario"> | string | null
    sector?: StringNullableWithAggregatesFilter<"FBRScenario"> | string | null
    isActive?: BoolWithAggregatesFilter<"FBRScenario"> | boolean
    registrationType?: StringNullableWithAggregatesFilter<"FBRScenario"> | string | null
    transactionType?: StringNullableWithAggregatesFilter<"FBRScenario"> | string | null
    taxRateApplicable?: FloatNullableWithAggregatesFilter<"FBRScenario"> | number | null
    specialConditions?: StringNullableListFilter<"FBRScenario">
    provinceRestrictions?: StringNullableListFilter<"FBRScenario">
    effectiveFrom?: DateTimeNullableWithAggregatesFilter<"FBRScenario"> | Date | string | null
    effectiveTo?: DateTimeNullableWithAggregatesFilter<"FBRScenario"> | Date | string | null
    priority?: IntNullableWithAggregatesFilter<"FBRScenario"> | number | null
    saleType?: StringNullableWithAggregatesFilter<"FBRScenario"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FBRScenario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FBRScenario"> | Date | string
  }

  export type FBRBusinessScenarioMappingWhereInput = {
    AND?: FBRBusinessScenarioMappingWhereInput | FBRBusinessScenarioMappingWhereInput[]
    OR?: FBRBusinessScenarioMappingWhereInput[]
    NOT?: FBRBusinessScenarioMappingWhereInput | FBRBusinessScenarioMappingWhereInput[]
    id?: StringFilter<"FBRBusinessScenarioMapping"> | string
    businessType?: StringFilter<"FBRBusinessScenarioMapping"> | string
    industrySector?: StringFilter<"FBRBusinessScenarioMapping"> | string
    scenarioIds?: StringNullableListFilter<"FBRBusinessScenarioMapping">
    isActive?: BoolFilter<"FBRBusinessScenarioMapping"> | boolean
    createdAt?: DateTimeFilter<"FBRBusinessScenarioMapping"> | Date | string
    updatedAt?: DateTimeFilter<"FBRBusinessScenarioMapping"> | Date | string
  }

  export type FBRBusinessScenarioMappingOrderByWithRelationInput = {
    id?: SortOrder
    businessType?: SortOrder
    industrySector?: SortOrder
    scenarioIds?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRBusinessScenarioMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessType_industrySector?: FBRBusinessScenarioMappingBusinessTypeIndustrySectorCompoundUniqueInput
    AND?: FBRBusinessScenarioMappingWhereInput | FBRBusinessScenarioMappingWhereInput[]
    OR?: FBRBusinessScenarioMappingWhereInput[]
    NOT?: FBRBusinessScenarioMappingWhereInput | FBRBusinessScenarioMappingWhereInput[]
    businessType?: StringFilter<"FBRBusinessScenarioMapping"> | string
    industrySector?: StringFilter<"FBRBusinessScenarioMapping"> | string
    scenarioIds?: StringNullableListFilter<"FBRBusinessScenarioMapping">
    isActive?: BoolFilter<"FBRBusinessScenarioMapping"> | boolean
    createdAt?: DateTimeFilter<"FBRBusinessScenarioMapping"> | Date | string
    updatedAt?: DateTimeFilter<"FBRBusinessScenarioMapping"> | Date | string
  }, "id" | "businessType_industrySector">

  export type FBRBusinessScenarioMappingOrderByWithAggregationInput = {
    id?: SortOrder
    businessType?: SortOrder
    industrySector?: SortOrder
    scenarioIds?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FBRBusinessScenarioMappingCountOrderByAggregateInput
    _max?: FBRBusinessScenarioMappingMaxOrderByAggregateInput
    _min?: FBRBusinessScenarioMappingMinOrderByAggregateInput
  }

  export type FBRBusinessScenarioMappingScalarWhereWithAggregatesInput = {
    AND?: FBRBusinessScenarioMappingScalarWhereWithAggregatesInput | FBRBusinessScenarioMappingScalarWhereWithAggregatesInput[]
    OR?: FBRBusinessScenarioMappingScalarWhereWithAggregatesInput[]
    NOT?: FBRBusinessScenarioMappingScalarWhereWithAggregatesInput | FBRBusinessScenarioMappingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FBRBusinessScenarioMapping"> | string
    businessType?: StringWithAggregatesFilter<"FBRBusinessScenarioMapping"> | string
    industrySector?: StringWithAggregatesFilter<"FBRBusinessScenarioMapping"> | string
    scenarioIds?: StringNullableListFilter<"FBRBusinessScenarioMapping">
    isActive?: BoolWithAggregatesFilter<"FBRBusinessScenarioMapping"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"FBRBusinessScenarioMapping"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FBRBusinessScenarioMapping"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    businesses?: BusinessCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    businesses?: BusinessUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    businesses?: BusinessUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    businesses?: BusinessUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserSessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessCreateInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBusinessesInput
    invoices?: InvoiceCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    products?: ProductCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateInput = {
    id?: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    products?: ProductUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    invoices?: InvoiceUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    products?: ProductUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    products?: ProductUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateManyInput = {
    id?: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BusinessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    invoices?: InvoiceCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    businessId: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    invoices?: InvoiceUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    businessId: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutInvoicesInput
    customer?: CustomerCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    businessId: string
    customerId?: string | null
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInvoicesNestedInput
    customer?: CustomerUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    businessId: string
    customerId?: string | null
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemCreateInput = {
    id?: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
    invoice: InvoiceCreateNestedOneWithoutItemsInput
  }

  export type InvoiceItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
  }

  export type InvoiceItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    invoice?: InvoiceUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InvoiceItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceItemCreateManyInput = {
    id?: string
    invoiceId: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
  }

  export type InvoiceItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    businessId: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateManyInput = {
    id?: string
    businessId: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BulkInvoiceBatchCreateInput = {
    id?: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus?: $Enums.ProcessingStatus
    validationStatus?: $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    processedAt?: Date | string | null
    completedAt?: Date | string | null
    items?: BulkInvoiceItemCreateNestedManyWithoutBatchInput
  }

  export type BulkInvoiceBatchUncheckedCreateInput = {
    id?: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus?: $Enums.ProcessingStatus
    validationStatus?: $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    processedAt?: Date | string | null
    completedAt?: Date | string | null
    items?: BulkInvoiceItemUncheckedCreateNestedManyWithoutBatchInput
  }

  export type BulkInvoiceBatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    items?: BulkInvoiceItemUpdateManyWithoutBatchNestedInput
  }

  export type BulkInvoiceBatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    items?: BulkInvoiceItemUncheckedUpdateManyWithoutBatchNestedInput
  }

  export type BulkInvoiceBatchCreateManyInput = {
    id?: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus?: $Enums.ProcessingStatus
    validationStatus?: $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    processedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type BulkInvoiceBatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceBatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceItemCreateInput = {
    id?: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
    batch: BulkInvoiceBatchCreateNestedOneWithoutItemsInput
  }

  export type BulkInvoiceItemUncheckedCreateInput = {
    id?: string
    batchId: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
  }

  export type BulkInvoiceItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batch?: BulkInvoiceBatchUpdateOneRequiredWithoutItemsNestedInput
  }

  export type BulkInvoiceItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceItemCreateManyInput = {
    id?: string
    batchId: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
  }

  export type BulkInvoiceItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SystemConfigCreateInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    userId?: string | null
    businessId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    businessId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId?: string | null
    businessId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRScenarioCreateInput = {
    code: string
    description: string
    businessType?: string | null
    sector?: string | null
    isActive?: boolean
    registrationType?: string | null
    transactionType?: string | null
    taxRateApplicable?: number | null
    specialConditions?: FBRScenarioCreatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioCreateprovinceRestrictionsInput | string[]
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    priority?: number | null
    saleType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRScenarioUncheckedCreateInput = {
    code: string
    description: string
    businessType?: string | null
    sector?: string | null
    isActive?: boolean
    registrationType?: string | null
    transactionType?: string | null
    taxRateApplicable?: number | null
    specialConditions?: FBRScenarioCreatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioCreateprovinceRestrictionsInput | string[]
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    priority?: number | null
    saleType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRScenarioUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registrationType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionType?: NullableStringFieldUpdateOperationsInput | string | null
    taxRateApplicable?: NullableFloatFieldUpdateOperationsInput | number | null
    specialConditions?: FBRScenarioUpdatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioUpdateprovinceRestrictionsInput | string[]
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableIntFieldUpdateOperationsInput | number | null
    saleType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRScenarioUncheckedUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registrationType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionType?: NullableStringFieldUpdateOperationsInput | string | null
    taxRateApplicable?: NullableFloatFieldUpdateOperationsInput | number | null
    specialConditions?: FBRScenarioUpdatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioUpdateprovinceRestrictionsInput | string[]
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableIntFieldUpdateOperationsInput | number | null
    saleType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRScenarioCreateManyInput = {
    code: string
    description: string
    businessType?: string | null
    sector?: string | null
    isActive?: boolean
    registrationType?: string | null
    transactionType?: string | null
    taxRateApplicable?: number | null
    specialConditions?: FBRScenarioCreatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioCreateprovinceRestrictionsInput | string[]
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    priority?: number | null
    saleType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRScenarioUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registrationType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionType?: NullableStringFieldUpdateOperationsInput | string | null
    taxRateApplicable?: NullableFloatFieldUpdateOperationsInput | number | null
    specialConditions?: FBRScenarioUpdatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioUpdateprovinceRestrictionsInput | string[]
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableIntFieldUpdateOperationsInput | number | null
    saleType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRScenarioUncheckedUpdateManyInput = {
    code?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registrationType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionType?: NullableStringFieldUpdateOperationsInput | string | null
    taxRateApplicable?: NullableFloatFieldUpdateOperationsInput | number | null
    specialConditions?: FBRScenarioUpdatespecialConditionsInput | string[]
    provinceRestrictions?: FBRScenarioUpdateprovinceRestrictionsInput | string[]
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableIntFieldUpdateOperationsInput | number | null
    saleType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRBusinessScenarioMappingCreateInput = {
    id?: string
    businessType: string
    industrySector: string
    scenarioIds?: FBRBusinessScenarioMappingCreatescenarioIdsInput | string[]
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRBusinessScenarioMappingUncheckedCreateInput = {
    id?: string
    businessType: string
    industrySector: string
    scenarioIds?: FBRBusinessScenarioMappingCreatescenarioIdsInput | string[]
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRBusinessScenarioMappingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    industrySector?: StringFieldUpdateOperationsInput | string
    scenarioIds?: FBRBusinessScenarioMappingUpdatescenarioIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRBusinessScenarioMappingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    industrySector?: StringFieldUpdateOperationsInput | string
    scenarioIds?: FBRBusinessScenarioMappingUpdatescenarioIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRBusinessScenarioMappingCreateManyInput = {
    id?: string
    businessType: string
    industrySector: string
    scenarioIds?: FBRBusinessScenarioMappingCreatescenarioIdsInput | string[]
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FBRBusinessScenarioMappingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    industrySector?: StringFieldUpdateOperationsInput | string
    scenarioIds?: FBRBusinessScenarioMappingUpdatescenarioIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FBRBusinessScenarioMappingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    industrySector?: StringFieldUpdateOperationsInput | string
    scenarioIds?: FBRBusinessScenarioMappingUpdatescenarioIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumSubscriptionPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanFilter<$PrismaModel> | $Enums.SubscriptionPlan
  }

  export type BusinessListRelationFilter = {
    every?: BusinessWhereInput
    some?: BusinessWhereInput
    none?: BusinessWhereInput
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BusinessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLogin?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionEnd?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLogin?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionEnd?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLogin?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionEnd?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumSubscriptionPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
  }

  export type EnumIntegrationModeFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationMode | EnumIntegrationModeFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationModeFilter<$PrismaModel> | $Enums.IntegrationMode
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type CustomerListRelationFilter = {
    every?: CustomerWhereInput
    some?: CustomerWhereInput
    none?: CustomerWhereInput
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BusinessCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    ntnNumber?: SortOrder
    address?: SortOrder
    province?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    fbrSetupComplete?: SortOrder
    fbrSetupSkipped?: SortOrder
    integrationMode?: SortOrder
    sandboxValidated?: SortOrder
    productionEnabled?: SortOrder
    sandboxToken?: SortOrder
    productionToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    ntnNumber?: SortOrder
    address?: SortOrder
    province?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    fbrSetupComplete?: SortOrder
    fbrSetupSkipped?: SortOrder
    integrationMode?: SortOrder
    sandboxValidated?: SortOrder
    productionEnabled?: SortOrder
    sandboxToken?: SortOrder
    productionToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyName?: SortOrder
    ntnNumber?: SortOrder
    address?: SortOrder
    province?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    fbrSetupComplete?: SortOrder
    fbrSetupSkipped?: SortOrder
    integrationMode?: SortOrder
    sandboxValidated?: SortOrder
    productionEnabled?: SortOrder
    sandboxToken?: SortOrder
    productionToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumIntegrationModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationMode | EnumIntegrationModeFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationModeWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationModeFilter<$PrismaModel>
    _max?: NestedEnumIntegrationModeFilter<$PrismaModel>
  }

  export type EnumRegistrationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RegistrationType | EnumRegistrationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRegistrationTypeFilter<$PrismaModel> | $Enums.RegistrationType
  }

  export type BusinessRelationFilter = {
    is?: BusinessWhereInput
    isNot?: BusinessWhereInput
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    province?: SortOrder
    postalCode?: SortOrder
    ntnNumber?: SortOrder
    registrationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    province?: SortOrder
    postalCode?: SortOrder
    ntnNumber?: SortOrder
    registrationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    province?: SortOrder
    postalCode?: SortOrder
    ntnNumber?: SortOrder
    registrationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumRegistrationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RegistrationType | EnumRegistrationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRegistrationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RegistrationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRegistrationTypeFilter<$PrismaModel>
    _max?: NestedEnumRegistrationTypeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CustomerNullableRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type InvoiceItemListRelationFilter = {
    every?: InvoiceItemWhereInput
    some?: InvoiceItemWhereInput
    none?: InvoiceItemWhereInput
  }

  export type InvoiceItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceBusinessIdInvoiceSequenceCompoundUniqueInput = {
    businessId: string
    invoiceSequence: number
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    localInvoiceNumber?: SortOrder
    invoiceSequence?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
    status?: SortOrder
    mode?: SortOrder
    fbrSubmitted?: SortOrder
    fbrValidated?: SortOrder
    submissionTimestamp?: SortOrder
    fbrInvoiceNumber?: SortOrder
    locallyGeneratedQRCode?: SortOrder
    fbrTimestamp?: SortOrder
    fbrTransmissionId?: SortOrder
    fbrAcknowledgmentNumber?: SortOrder
    fbrResponse?: SortOrder
    pdfGenerated?: SortOrder
    pdfStoragePath?: SortOrder
    encryptedData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    invoiceSequence?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    localInvoiceNumber?: SortOrder
    invoiceSequence?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
    status?: SortOrder
    mode?: SortOrder
    fbrSubmitted?: SortOrder
    fbrValidated?: SortOrder
    submissionTimestamp?: SortOrder
    fbrInvoiceNumber?: SortOrder
    locallyGeneratedQRCode?: SortOrder
    fbrTimestamp?: SortOrder
    fbrTransmissionId?: SortOrder
    fbrAcknowledgmentNumber?: SortOrder
    pdfGenerated?: SortOrder
    pdfStoragePath?: SortOrder
    encryptedData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    localInvoiceNumber?: SortOrder
    invoiceSequence?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
    status?: SortOrder
    mode?: SortOrder
    fbrSubmitted?: SortOrder
    fbrValidated?: SortOrder
    submissionTimestamp?: SortOrder
    fbrInvoiceNumber?: SortOrder
    locallyGeneratedQRCode?: SortOrder
    fbrTimestamp?: SortOrder
    fbrTransmissionId?: SortOrder
    fbrAcknowledgmentNumber?: SortOrder
    pdfGenerated?: SortOrder
    pdfStoragePath?: SortOrder
    encryptedData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    invoiceSequence?: SortOrder
    subtotal?: SortOrder
    taxAmount?: SortOrder
    totalAmount?: SortOrder
    discount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type InvoiceRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type InvoiceItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    exemptionSRO?: SortOrder
    unitOfMeasurement?: SortOrder
  }

  export type InvoiceItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
  }

  export type InvoiceItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    exemptionSRO?: SortOrder
    unitOfMeasurement?: SortOrder
  }

  export type InvoiceItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    exemptionSRO?: SortOrder
    unitOfMeasurement?: SortOrder
  }

  export type InvoiceItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalValue?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    unitOfMeasurement?: SortOrder
    unitPrice?: SortOrder
    taxRate?: SortOrder
    category?: SortOrder
    sku?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    unitPrice?: SortOrder
    taxRate?: SortOrder
    stock?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    unitOfMeasurement?: SortOrder
    unitPrice?: SortOrder
    taxRate?: SortOrder
    category?: SortOrder
    sku?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    hsCode?: SortOrder
    unitOfMeasurement?: SortOrder
    unitPrice?: SortOrder
    taxRate?: SortOrder
    category?: SortOrder
    sku?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    unitPrice?: SortOrder
    taxRate?: SortOrder
    stock?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumProcessingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusFilter<$PrismaModel> | $Enums.ProcessingStatus
  }

  export type EnumValidationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ValidationStatus | EnumValidationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumValidationStatusFilter<$PrismaModel> | $Enums.ValidationStatus
  }

  export type BulkInvoiceItemListRelationFilter = {
    every?: BulkInvoiceItemWhereInput
    some?: BulkInvoiceItemWhereInput
    none?: BulkInvoiceItemWhereInput
  }

  export type BulkInvoiceItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BulkInvoiceBatchCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
    processingStatus?: SortOrder
    validationStatus?: SortOrder
    validationErrors?: SortOrder
    processingErrors?: SortOrder
    uploadedAt?: SortOrder
    processedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BulkInvoiceBatchAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
  }

  export type BulkInvoiceBatchMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
    processingStatus?: SortOrder
    validationStatus?: SortOrder
    uploadedAt?: SortOrder
    processedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BulkInvoiceBatchMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
    processingStatus?: SortOrder
    validationStatus?: SortOrder
    uploadedAt?: SortOrder
    processedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BulkInvoiceBatchSumOrderByAggregateInput = {
    fileSize?: SortOrder
    totalRecords?: SortOrder
    validRecords?: SortOrder
    invalidRecords?: SortOrder
  }

  export type EnumProcessingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingStatusFilter<$PrismaModel>
    _max?: NestedEnumProcessingStatusFilter<$PrismaModel>
  }

  export type EnumValidationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ValidationStatus | EnumValidationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumValidationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ValidationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumValidationStatusFilter<$PrismaModel>
    _max?: NestedEnumValidationStatusFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BulkInvoiceBatchRelationFilter = {
    is?: BulkInvoiceBatchWhereInput
    isNot?: BulkInvoiceBatchWhereInput
  }

  export type BulkInvoiceItemCountOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    localId?: SortOrder
    dataValid?: SortOrder
    sandboxValidated?: SortOrder
    sandboxSubmitted?: SortOrder
    productionSubmitted?: SortOrder
    validationErrors?: SortOrder
    sandboxResponse?: SortOrder
    productionResponse?: SortOrder
    fbrInvoiceNumber?: SortOrder
    invoiceData?: SortOrder
    processedAt?: SortOrder
  }

  export type BulkInvoiceItemAvgOrderByAggregateInput = {
    rowNumber?: SortOrder
  }

  export type BulkInvoiceItemMaxOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    localId?: SortOrder
    dataValid?: SortOrder
    sandboxValidated?: SortOrder
    sandboxSubmitted?: SortOrder
    productionSubmitted?: SortOrder
    fbrInvoiceNumber?: SortOrder
    processedAt?: SortOrder
  }

  export type BulkInvoiceItemMinOrderByAggregateInput = {
    id?: SortOrder
    batchId?: SortOrder
    rowNumber?: SortOrder
    localId?: SortOrder
    dataValid?: SortOrder
    sandboxValidated?: SortOrder
    sandboxSubmitted?: SortOrder
    productionSubmitted?: SortOrder
    fbrInvoiceNumber?: SortOrder
    processedAt?: SortOrder
  }

  export type BulkInvoiceItemSumOrderByAggregateInput = {
    rowNumber?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SystemConfigCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    oldValues?: SortOrder
    newValues?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    businessId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FBRScenarioCountOrderByAggregateInput = {
    code?: SortOrder
    description?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    isActive?: SortOrder
    registrationType?: SortOrder
    transactionType?: SortOrder
    taxRateApplicable?: SortOrder
    specialConditions?: SortOrder
    provinceRestrictions?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    priority?: SortOrder
    saleType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRScenarioAvgOrderByAggregateInput = {
    taxRateApplicable?: SortOrder
    priority?: SortOrder
  }

  export type FBRScenarioMaxOrderByAggregateInput = {
    code?: SortOrder
    description?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    isActive?: SortOrder
    registrationType?: SortOrder
    transactionType?: SortOrder
    taxRateApplicable?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    priority?: SortOrder
    saleType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRScenarioMinOrderByAggregateInput = {
    code?: SortOrder
    description?: SortOrder
    businessType?: SortOrder
    sector?: SortOrder
    isActive?: SortOrder
    registrationType?: SortOrder
    transactionType?: SortOrder
    taxRateApplicable?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    priority?: SortOrder
    saleType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRScenarioSumOrderByAggregateInput = {
    taxRateApplicable?: SortOrder
    priority?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FBRBusinessScenarioMappingBusinessTypeIndustrySectorCompoundUniqueInput = {
    businessType: string
    industrySector: string
  }

  export type FBRBusinessScenarioMappingCountOrderByAggregateInput = {
    id?: SortOrder
    businessType?: SortOrder
    industrySector?: SortOrder
    scenarioIds?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRBusinessScenarioMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    businessType?: SortOrder
    industrySector?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FBRBusinessScenarioMappingMinOrderByAggregateInput = {
    id?: SortOrder
    businessType?: SortOrder
    industrySector?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessCreateNestedManyWithoutUserInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type BusinessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumSubscriptionPlanFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionPlan
  }

  export type BusinessUpdateManyWithoutUserNestedInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutUserInput | BusinessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutUserInput | BusinessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutUserInput | BusinessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type BusinessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutUserInput | BusinessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutUserInput | BusinessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutUserInput | BusinessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutBusinessesInput = {
    create?: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesInput
    connect?: UserWhereUniqueInput
  }

  export type InvoiceCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput> | InvoiceCreateWithoutBusinessInput[] | InvoiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBusinessInput | InvoiceCreateOrConnectWithoutBusinessInput[]
    createMany?: InvoiceCreateManyBusinessInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type CustomerCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type ProductCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput> | ProductCreateWithoutBusinessInput[] | ProductUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBusinessInput | ProductCreateOrConnectWithoutBusinessInput[]
    createMany?: ProductCreateManyBusinessInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput> | InvoiceCreateWithoutBusinessInput[] | InvoiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBusinessInput | InvoiceCreateOrConnectWithoutBusinessInput[]
    createMany?: InvoiceCreateManyBusinessInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput> | ProductCreateWithoutBusinessInput[] | ProductUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBusinessInput | ProductCreateOrConnectWithoutBusinessInput[]
    createMany?: ProductCreateManyBusinessInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type EnumIntegrationModeFieldUpdateOperationsInput = {
    set?: $Enums.IntegrationMode
  }

  export type UserUpdateOneRequiredWithoutBusinessesNestedInput = {
    create?: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesInput
    upsert?: UserUpsertWithoutBusinessesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBusinessesInput, UserUpdateWithoutBusinessesInput>, UserUncheckedUpdateWithoutBusinessesInput>
  }

  export type InvoiceUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput> | InvoiceCreateWithoutBusinessInput[] | InvoiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBusinessInput | InvoiceCreateOrConnectWithoutBusinessInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutBusinessInput | InvoiceUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InvoiceCreateManyBusinessInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutBusinessInput | InvoiceUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutBusinessInput | InvoiceUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type CustomerUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type ProductUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput> | ProductCreateWithoutBusinessInput[] | ProductUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBusinessInput | ProductCreateOrConnectWithoutBusinessInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutBusinessInput | ProductUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ProductCreateManyBusinessInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutBusinessInput | ProductUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutBusinessInput | ProductUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput> | InvoiceCreateWithoutBusinessInput[] | InvoiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBusinessInput | InvoiceCreateOrConnectWithoutBusinessInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutBusinessInput | InvoiceUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InvoiceCreateManyBusinessInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutBusinessInput | InvoiceUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutBusinessInput | InvoiceUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput> | ProductCreateWithoutBusinessInput[] | ProductUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBusinessInput | ProductCreateOrConnectWithoutBusinessInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutBusinessInput | ProductUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ProductCreateManyBusinessInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutBusinessInput | ProductUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutBusinessInput | ProductUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutCustomersInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
  }

  export type InvoiceCreateNestedManyWithoutCustomerInput = {
    create?: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput> | InvoiceCreateWithoutCustomerInput[] | InvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutCustomerInput | InvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: InvoiceCreateManyCustomerInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput> | InvoiceCreateWithoutCustomerInput[] | InvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutCustomerInput | InvoiceCreateOrConnectWithoutCustomerInput[]
    createMany?: InvoiceCreateManyCustomerInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type EnumRegistrationTypeFieldUpdateOperationsInput = {
    set?: $Enums.RegistrationType
  }

  export type BusinessUpdateOneRequiredWithoutCustomersNestedInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    upsert?: BusinessUpsertWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutCustomersInput, BusinessUpdateWithoutCustomersInput>, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type InvoiceUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput> | InvoiceCreateWithoutCustomerInput[] | InvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutCustomerInput | InvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutCustomerInput | InvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: InvoiceCreateManyCustomerInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutCustomerInput | InvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutCustomerInput | InvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput> | InvoiceCreateWithoutCustomerInput[] | InvoiceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutCustomerInput | InvoiceCreateOrConnectWithoutCustomerInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutCustomerInput | InvoiceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: InvoiceCreateManyCustomerInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutCustomerInput | InvoiceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutCustomerInput | InvoiceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<BusinessCreateWithoutInvoicesInput, BusinessUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInvoicesInput
    connect?: BusinessWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutInvoicesInput
    connect?: CustomerWhereUniqueInput
  }

  export type InvoiceItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvoiceStatus
  }

  export type BusinessUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<BusinessCreateWithoutInvoicesInput, BusinessUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInvoicesInput
    upsert?: BusinessUpsertWithoutInvoicesInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutInvoicesInput, BusinessUpdateWithoutInvoicesInput>, BusinessUncheckedUpdateWithoutInvoicesInput>
  }

  export type CustomerUpdateOneWithoutInvoicesNestedInput = {
    create?: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutInvoicesInput
    upsert?: CustomerUpsertWithoutInvoicesInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutInvoicesInput, CustomerUpdateWithoutInvoicesInput>, CustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type InvoiceItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutItemsInput = {
    create?: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutItemsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutItemsInput
    upsert?: InvoiceUpsertWithoutItemsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutItemsInput, InvoiceUpdateWithoutItemsInput>, InvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type BusinessCreateNestedOneWithoutProductsInput = {
    create?: XOR<BusinessCreateWithoutProductsInput, BusinessUncheckedCreateWithoutProductsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutProductsInput
    connect?: BusinessWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BusinessUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<BusinessCreateWithoutProductsInput, BusinessUncheckedCreateWithoutProductsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutProductsInput
    upsert?: BusinessUpsertWithoutProductsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutProductsInput, BusinessUpdateWithoutProductsInput>, BusinessUncheckedUpdateWithoutProductsInput>
  }

  export type BulkInvoiceItemCreateNestedManyWithoutBatchInput = {
    create?: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput> | BulkInvoiceItemCreateWithoutBatchInput[] | BulkInvoiceItemUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: BulkInvoiceItemCreateOrConnectWithoutBatchInput | BulkInvoiceItemCreateOrConnectWithoutBatchInput[]
    createMany?: BulkInvoiceItemCreateManyBatchInputEnvelope
    connect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
  }

  export type BulkInvoiceItemUncheckedCreateNestedManyWithoutBatchInput = {
    create?: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput> | BulkInvoiceItemCreateWithoutBatchInput[] | BulkInvoiceItemUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: BulkInvoiceItemCreateOrConnectWithoutBatchInput | BulkInvoiceItemCreateOrConnectWithoutBatchInput[]
    createMany?: BulkInvoiceItemCreateManyBatchInputEnvelope
    connect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
  }

  export type EnumProcessingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProcessingStatus
  }

  export type EnumValidationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ValidationStatus
  }

  export type BulkInvoiceItemUpdateManyWithoutBatchNestedInput = {
    create?: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput> | BulkInvoiceItemCreateWithoutBatchInput[] | BulkInvoiceItemUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: BulkInvoiceItemCreateOrConnectWithoutBatchInput | BulkInvoiceItemCreateOrConnectWithoutBatchInput[]
    upsert?: BulkInvoiceItemUpsertWithWhereUniqueWithoutBatchInput | BulkInvoiceItemUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: BulkInvoiceItemCreateManyBatchInputEnvelope
    set?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    disconnect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    delete?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    connect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    update?: BulkInvoiceItemUpdateWithWhereUniqueWithoutBatchInput | BulkInvoiceItemUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: BulkInvoiceItemUpdateManyWithWhereWithoutBatchInput | BulkInvoiceItemUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: BulkInvoiceItemScalarWhereInput | BulkInvoiceItemScalarWhereInput[]
  }

  export type BulkInvoiceItemUncheckedUpdateManyWithoutBatchNestedInput = {
    create?: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput> | BulkInvoiceItemCreateWithoutBatchInput[] | BulkInvoiceItemUncheckedCreateWithoutBatchInput[]
    connectOrCreate?: BulkInvoiceItemCreateOrConnectWithoutBatchInput | BulkInvoiceItemCreateOrConnectWithoutBatchInput[]
    upsert?: BulkInvoiceItemUpsertWithWhereUniqueWithoutBatchInput | BulkInvoiceItemUpsertWithWhereUniqueWithoutBatchInput[]
    createMany?: BulkInvoiceItemCreateManyBatchInputEnvelope
    set?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    disconnect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    delete?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    connect?: BulkInvoiceItemWhereUniqueInput | BulkInvoiceItemWhereUniqueInput[]
    update?: BulkInvoiceItemUpdateWithWhereUniqueWithoutBatchInput | BulkInvoiceItemUpdateWithWhereUniqueWithoutBatchInput[]
    updateMany?: BulkInvoiceItemUpdateManyWithWhereWithoutBatchInput | BulkInvoiceItemUpdateManyWithWhereWithoutBatchInput[]
    deleteMany?: BulkInvoiceItemScalarWhereInput | BulkInvoiceItemScalarWhereInput[]
  }

  export type BulkInvoiceBatchCreateNestedOneWithoutItemsInput = {
    create?: XOR<BulkInvoiceBatchCreateWithoutItemsInput, BulkInvoiceBatchUncheckedCreateWithoutItemsInput>
    connectOrCreate?: BulkInvoiceBatchCreateOrConnectWithoutItemsInput
    connect?: BulkInvoiceBatchWhereUniqueInput
  }

  export type BulkInvoiceBatchUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<BulkInvoiceBatchCreateWithoutItemsInput, BulkInvoiceBatchUncheckedCreateWithoutItemsInput>
    connectOrCreate?: BulkInvoiceBatchCreateOrConnectWithoutItemsInput
    upsert?: BulkInvoiceBatchUpsertWithoutItemsInput
    connect?: BulkInvoiceBatchWhereUniqueInput
    update?: XOR<XOR<BulkInvoiceBatchUpdateToOneWithWhereWithoutItemsInput, BulkInvoiceBatchUpdateWithoutItemsInput>, BulkInvoiceBatchUncheckedUpdateWithoutItemsInput>
  }

  export type FBRScenarioCreatespecialConditionsInput = {
    set: string[]
  }

  export type FBRScenarioCreateprovinceRestrictionsInput = {
    set: string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FBRScenarioUpdatespecialConditionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FBRScenarioUpdateprovinceRestrictionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FBRBusinessScenarioMappingCreatescenarioIdsInput = {
    set: string[]
  }

  export type FBRBusinessScenarioMappingUpdatescenarioIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSubscriptionPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanFilter<$PrismaModel> | $Enums.SubscriptionPlan
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
  }

  export type NestedEnumIntegrationModeFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationMode | EnumIntegrationModeFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationModeFilter<$PrismaModel> | $Enums.IntegrationMode
  }

  export type NestedEnumIntegrationModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationMode | EnumIntegrationModeFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationMode[] | ListEnumIntegrationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationModeWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationModeFilter<$PrismaModel>
    _max?: NestedEnumIntegrationModeFilter<$PrismaModel>
  }

  export type NestedEnumRegistrationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RegistrationType | EnumRegistrationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRegistrationTypeFilter<$PrismaModel> | $Enums.RegistrationType
  }

  export type NestedEnumRegistrationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RegistrationType | EnumRegistrationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RegistrationType[] | ListEnumRegistrationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRegistrationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RegistrationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRegistrationTypeFilter<$PrismaModel>
    _max?: NestedEnumRegistrationTypeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProcessingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusFilter<$PrismaModel> | $Enums.ProcessingStatus
  }

  export type NestedEnumValidationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ValidationStatus | EnumValidationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumValidationStatusFilter<$PrismaModel> | $Enums.ValidationStatus
  }

  export type NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingStatusFilter<$PrismaModel>
    _max?: NestedEnumProcessingStatusFilter<$PrismaModel>
  }

  export type NestedEnumValidationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ValidationStatus | EnumValidationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ValidationStatus[] | ListEnumValidationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumValidationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ValidationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumValidationStatusFilter<$PrismaModel>
    _max?: NestedEnumValidationStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BusinessCreateWithoutUserInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    products?: ProductCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutUserInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    products?: ProductUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutUserInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput>
  }

  export type BusinessCreateManyUserInputEnvelope = {
    data: BusinessCreateManyUserInput | BusinessCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithWhereUniqueWithoutUserInput = {
    where: BusinessWhereUniqueInput
    update: XOR<BusinessUpdateWithoutUserInput, BusinessUncheckedUpdateWithoutUserInput>
    create: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput>
  }

  export type BusinessUpdateWithWhereUniqueWithoutUserInput = {
    where: BusinessWhereUniqueInput
    data: XOR<BusinessUpdateWithoutUserInput, BusinessUncheckedUpdateWithoutUserInput>
  }

  export type BusinessUpdateManyWithWhereWithoutUserInput = {
    where: BusinessScalarWhereInput
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyWithoutUserInput>
  }

  export type BusinessScalarWhereInput = {
    AND?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    OR?: BusinessScalarWhereInput[]
    NOT?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    id?: StringFilter<"Business"> | string
    userId?: StringFilter<"Business"> | string
    companyName?: StringFilter<"Business"> | string
    ntnNumber?: StringFilter<"Business"> | string
    address?: StringFilter<"Business"> | string
    province?: StringFilter<"Business"> | string
    city?: StringNullableFilter<"Business"> | string | null
    postalCode?: StringNullableFilter<"Business"> | string | null
    businessType?: StringFilter<"Business"> | string
    sector?: StringFilter<"Business"> | string
    phoneNumber?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    website?: StringNullableFilter<"Business"> | string | null
    fbrSetupComplete?: BoolFilter<"Business"> | boolean
    fbrSetupSkipped?: BoolFilter<"Business"> | boolean
    integrationMode?: EnumIntegrationModeFilter<"Business"> | $Enums.IntegrationMode
    sandboxValidated?: BoolFilter<"Business"> | boolean
    productionEnabled?: BoolFilter<"Business"> | boolean
    sandboxToken?: StringNullableFilter<"Business"> | string | null
    productionToken?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    token?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    businesses?: BusinessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    businesses?: BusinessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    businesses?: BusinessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    businesses?: BusinessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutBusinessesInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    sessions?: UserSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBusinessesInput = {
    id?: string
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLogin?: Date | string | null
    subscriptionPlan?: $Enums.SubscriptionPlan
    subscriptionEnd?: Date | string | null
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBusinessesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
  }

  export type InvoiceCreateWithoutBusinessInput = {
    id?: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutBusinessInput = {
    id?: string
    customerId?: string | null
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutBusinessInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput>
  }

  export type InvoiceCreateManyBusinessInputEnvelope = {
    data: InvoiceCreateManyBusinessInput | InvoiceCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type CustomerCreateWithoutBusinessInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerCreateManyBusinessInputEnvelope = {
    data: CustomerCreateManyBusinessInput | CustomerCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ProductCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateOrConnectWithoutBusinessInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput>
  }

  export type ProductCreateManyBusinessInputEnvelope = {
    data: ProductCreateManyBusinessInput | ProductCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBusinessesInput = {
    update: XOR<UserUpdateWithoutBusinessesInput, UserUncheckedUpdateWithoutBusinessesInput>
    create: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBusinessesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBusinessesInput, UserUncheckedUpdateWithoutBusinessesInput>
  }

  export type UserUpdateWithoutBusinessesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBusinessesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionPlan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type InvoiceUpsertWithWhereUniqueWithoutBusinessInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutBusinessInput, InvoiceUncheckedUpdateWithoutBusinessInput>
    create: XOR<InvoiceCreateWithoutBusinessInput, InvoiceUncheckedCreateWithoutBusinessInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutBusinessInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutBusinessInput, InvoiceUncheckedUpdateWithoutBusinessInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutBusinessInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutBusinessInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    businessId?: StringFilter<"Invoice"> | string
    customerId?: StringNullableFilter<"Invoice"> | string | null
    localInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    invoiceSequence?: IntFilter<"Invoice"> | number
    invoiceDate?: StringFilter<"Invoice"> | string
    dueDate?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    subtotal?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    totalAmount?: FloatFilter<"Invoice"> | number
    discount?: FloatFilter<"Invoice"> | number
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFilter<"Invoice"> | $Enums.IntegrationMode
    fbrSubmitted?: BoolFilter<"Invoice"> | boolean
    fbrValidated?: BoolFilter<"Invoice"> | boolean
    submissionTimestamp?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    fbrInvoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    locallyGeneratedQRCode?: StringNullableFilter<"Invoice"> | string | null
    fbrTimestamp?: StringNullableFilter<"Invoice"> | string | null
    fbrTransmissionId?: StringNullableFilter<"Invoice"> | string | null
    fbrAcknowledgmentNumber?: StringNullableFilter<"Invoice"> | string | null
    fbrResponse?: JsonNullableFilter<"Invoice">
    pdfGenerated?: BoolFilter<"Invoice"> | boolean
    pdfStoragePath?: StringNullableFilter<"Invoice"> | string | null
    encryptedData?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
  }

  export type CustomerUpsertWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
  }

  export type CustomerUpdateManyWithWhereWithoutBusinessInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutBusinessInput>
  }

  export type CustomerScalarWhereInput = {
    AND?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    OR?: CustomerScalarWhereInput[]
    NOT?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    id?: StringFilter<"Customer"> | string
    businessId?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    province?: StringNullableFilter<"Customer"> | string | null
    postalCode?: StringNullableFilter<"Customer"> | string | null
    ntnNumber?: StringNullableFilter<"Customer"> | string | null
    registrationType?: EnumRegistrationTypeFilter<"Customer"> | $Enums.RegistrationType
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
  }

  export type ProductUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutBusinessInput, ProductUncheckedUpdateWithoutBusinessInput>
    create: XOR<ProductCreateWithoutBusinessInput, ProductUncheckedCreateWithoutBusinessInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutBusinessInput, ProductUncheckedUpdateWithoutBusinessInput>
  }

  export type ProductUpdateManyWithWhereWithoutBusinessInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    businessId?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    hsCode?: StringFilter<"Product"> | string
    unitOfMeasurement?: StringFilter<"Product"> | string
    unitPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    taxRate?: IntFilter<"Product"> | number
    category?: StringNullableFilter<"Product"> | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    stock?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type BusinessCreateWithoutCustomersInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBusinessesInput
    invoices?: InvoiceCreateNestedManyWithoutBusinessInput
    products?: ProductCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutCustomersInput = {
    id?: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBusinessInput
    products?: ProductUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutCustomersInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
  }

  export type InvoiceCreateWithoutCustomerInput = {
    id?: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutCustomerInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type InvoiceCreateManyCustomerInputEnvelope = {
    data: InvoiceCreateManyCustomerInput | InvoiceCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutCustomersInput = {
    update: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutCustomersInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type BusinessUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    invoices?: InvoiceUpdateManyWithoutBusinessNestedInput
    products?: ProductUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBusinessNestedInput
    products?: ProductUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type InvoiceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutCustomerInput, InvoiceUncheckedUpdateWithoutCustomerInput>
    create: XOR<InvoiceCreateWithoutCustomerInput, InvoiceUncheckedCreateWithoutCustomerInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutCustomerInput, InvoiceUncheckedUpdateWithoutCustomerInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutCustomerInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutCustomerInput>
  }

  export type BusinessCreateWithoutInvoicesInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    products?: ProductCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutInvoicesInput = {
    id?: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    products?: ProductUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutInvoicesInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutInvoicesInput, BusinessUncheckedCreateWithoutInvoicesInput>
  }

  export type CustomerCreateWithoutInvoicesInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
  }

  export type CustomerUncheckedCreateWithoutInvoicesInput = {
    id?: string
    businessId: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutInvoicesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
  }

  export type InvoiceItemCreateWithoutInvoiceInput = {
    id?: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
  }

  export type InvoiceItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
  }

  export type InvoiceItemCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemCreateManyInvoiceInputEnvelope = {
    data: InvoiceItemCreateManyInvoiceInput | InvoiceItemCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutInvoicesInput = {
    update: XOR<BusinessUpdateWithoutInvoicesInput, BusinessUncheckedUpdateWithoutInvoicesInput>
    create: XOR<BusinessCreateWithoutInvoicesInput, BusinessUncheckedCreateWithoutInvoicesInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutInvoicesInput, BusinessUncheckedUpdateWithoutInvoicesInput>
  }

  export type BusinessUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    products?: ProductUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    products?: ProductUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type CustomerUpsertWithoutInvoicesInput = {
    update: XOR<CustomerUpdateWithoutInvoicesInput, CustomerUncheckedUpdateWithoutInvoicesInput>
    create: XOR<CustomerCreateWithoutInvoicesInput, CustomerUncheckedCreateWithoutInvoicesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutInvoicesInput, CustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type CustomerUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
  }

  export type CustomerUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    update: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    data: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceItemScalarWhereInput
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type InvoiceItemScalarWhereInput = {
    AND?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    OR?: InvoiceItemScalarWhereInput[]
    NOT?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    hsCode?: StringFilter<"InvoiceItem"> | string
    quantity?: FloatFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    totalValue?: FloatFilter<"InvoiceItem"> | number
    taxRate?: FloatFilter<"InvoiceItem"> | number
    taxAmount?: FloatFilter<"InvoiceItem"> | number
    exemptionSRO?: StringNullableFilter<"InvoiceItem"> | string | null
    unitOfMeasurement?: StringFilter<"InvoiceItem"> | string
  }

  export type InvoiceCreateWithoutItemsInput = {
    id?: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutInvoicesInput
    customer?: CustomerCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateWithoutItemsInput = {
    id?: string
    businessId: string
    customerId?: string | null
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutItemsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
  }

  export type InvoiceUpsertWithoutItemsInput = {
    update: XOR<InvoiceUpdateWithoutItemsInput, InvoiceUncheckedUpdateWithoutItemsInput>
    create: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutItemsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutItemsInput, InvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type InvoiceUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInvoicesNestedInput
    customer?: CustomerUpdateOneWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessCreateWithoutProductsInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBusinessesInput
    invoices?: InvoiceCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutProductsInput = {
    id?: string
    userId: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutProductsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutProductsInput, BusinessUncheckedCreateWithoutProductsInput>
  }

  export type BusinessUpsertWithoutProductsInput = {
    update: XOR<BusinessUpdateWithoutProductsInput, BusinessUncheckedUpdateWithoutProductsInput>
    create: XOR<BusinessCreateWithoutProductsInput, BusinessUncheckedCreateWithoutProductsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutProductsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutProductsInput, BusinessUncheckedUpdateWithoutProductsInput>
  }

  export type BusinessUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    invoices?: InvoiceUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BulkInvoiceItemCreateWithoutBatchInput = {
    id?: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
  }

  export type BulkInvoiceItemUncheckedCreateWithoutBatchInput = {
    id?: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
  }

  export type BulkInvoiceItemCreateOrConnectWithoutBatchInput = {
    where: BulkInvoiceItemWhereUniqueInput
    create: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput>
  }

  export type BulkInvoiceItemCreateManyBatchInputEnvelope = {
    data: BulkInvoiceItemCreateManyBatchInput | BulkInvoiceItemCreateManyBatchInput[]
    skipDuplicates?: boolean
  }

  export type BulkInvoiceItemUpsertWithWhereUniqueWithoutBatchInput = {
    where: BulkInvoiceItemWhereUniqueInput
    update: XOR<BulkInvoiceItemUpdateWithoutBatchInput, BulkInvoiceItemUncheckedUpdateWithoutBatchInput>
    create: XOR<BulkInvoiceItemCreateWithoutBatchInput, BulkInvoiceItemUncheckedCreateWithoutBatchInput>
  }

  export type BulkInvoiceItemUpdateWithWhereUniqueWithoutBatchInput = {
    where: BulkInvoiceItemWhereUniqueInput
    data: XOR<BulkInvoiceItemUpdateWithoutBatchInput, BulkInvoiceItemUncheckedUpdateWithoutBatchInput>
  }

  export type BulkInvoiceItemUpdateManyWithWhereWithoutBatchInput = {
    where: BulkInvoiceItemScalarWhereInput
    data: XOR<BulkInvoiceItemUpdateManyMutationInput, BulkInvoiceItemUncheckedUpdateManyWithoutBatchInput>
  }

  export type BulkInvoiceItemScalarWhereInput = {
    AND?: BulkInvoiceItemScalarWhereInput | BulkInvoiceItemScalarWhereInput[]
    OR?: BulkInvoiceItemScalarWhereInput[]
    NOT?: BulkInvoiceItemScalarWhereInput | BulkInvoiceItemScalarWhereInput[]
    id?: StringFilter<"BulkInvoiceItem"> | string
    batchId?: StringFilter<"BulkInvoiceItem"> | string
    rowNumber?: IntFilter<"BulkInvoiceItem"> | number
    localId?: StringFilter<"BulkInvoiceItem"> | string
    dataValid?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxValidated?: BoolFilter<"BulkInvoiceItem"> | boolean
    sandboxSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    productionSubmitted?: BoolFilter<"BulkInvoiceItem"> | boolean
    validationErrors?: JsonNullableFilter<"BulkInvoiceItem">
    sandboxResponse?: JsonNullableFilter<"BulkInvoiceItem">
    productionResponse?: JsonNullableFilter<"BulkInvoiceItem">
    fbrInvoiceNumber?: StringNullableFilter<"BulkInvoiceItem"> | string | null
    invoiceData?: JsonFilter<"BulkInvoiceItem">
    processedAt?: DateTimeNullableFilter<"BulkInvoiceItem"> | Date | string | null
  }

  export type BulkInvoiceBatchCreateWithoutItemsInput = {
    id?: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus?: $Enums.ProcessingStatus
    validationStatus?: $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    processedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type BulkInvoiceBatchUncheckedCreateWithoutItemsInput = {
    id?: string
    userId: string
    businessId: string
    fileName: string
    originalName: string
    fileSize: number
    totalRecords: number
    validRecords: number
    invalidRecords: number
    processingStatus?: $Enums.ProcessingStatus
    validationStatus?: $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    processedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type BulkInvoiceBatchCreateOrConnectWithoutItemsInput = {
    where: BulkInvoiceBatchWhereUniqueInput
    create: XOR<BulkInvoiceBatchCreateWithoutItemsInput, BulkInvoiceBatchUncheckedCreateWithoutItemsInput>
  }

  export type BulkInvoiceBatchUpsertWithoutItemsInput = {
    update: XOR<BulkInvoiceBatchUpdateWithoutItemsInput, BulkInvoiceBatchUncheckedUpdateWithoutItemsInput>
    create: XOR<BulkInvoiceBatchCreateWithoutItemsInput, BulkInvoiceBatchUncheckedCreateWithoutItemsInput>
    where?: BulkInvoiceBatchWhereInput
  }

  export type BulkInvoiceBatchUpdateToOneWithWhereWithoutItemsInput = {
    where?: BulkInvoiceBatchWhereInput
    data: XOR<BulkInvoiceBatchUpdateWithoutItemsInput, BulkInvoiceBatchUncheckedUpdateWithoutItemsInput>
  }

  export type BulkInvoiceBatchUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceBatchUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    totalRecords?: IntFieldUpdateOperationsInput | number
    validRecords?: IntFieldUpdateOperationsInput | number
    invalidRecords?: IntFieldUpdateOperationsInput | number
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    validationStatus?: EnumValidationStatusFieldUpdateOperationsInput | $Enums.ValidationStatus
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    processingErrors?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BusinessCreateManyUserInput = {
    id?: string
    companyName: string
    ntnNumber: string
    address: string
    province: string
    city?: string | null
    postalCode?: string | null
    businessType: string
    sector: string
    phoneNumber?: string | null
    email?: string | null
    website?: string | null
    fbrSetupComplete?: boolean
    fbrSetupSkipped?: boolean
    integrationMode?: $Enums.IntegrationMode
    sandboxValidated?: boolean
    productionEnabled?: boolean
    sandboxToken?: string | null
    productionToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
  }

  export type BusinessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    products?: ProductUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    products?: ProductUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    ntnNumber?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    fbrSetupComplete?: BoolFieldUpdateOperationsInput | boolean
    fbrSetupSkipped?: BoolFieldUpdateOperationsInput | boolean
    integrationMode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    productionEnabled?: BoolFieldUpdateOperationsInput | boolean
    sandboxToken?: NullableStringFieldUpdateOperationsInput | string | null
    productionToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyBusinessInput = {
    id?: string
    customerId?: string | null
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateManyBusinessInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    ntnNumber?: string | null
    registrationType?: $Enums.RegistrationType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateManyBusinessInput = {
    id?: string
    name: string
    description?: string | null
    hsCode: string
    unitOfMeasurement: string
    unitPrice: Decimal | DecimalJsLike | number | string
    taxRate?: number
    category?: string | null
    sku?: string | null
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    ntnNumber?: NullableStringFieldUpdateOperationsInput | string | null
    registrationType?: EnumRegistrationTypeFieldUpdateOperationsInput | $Enums.RegistrationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hsCode?: StringFieldUpdateOperationsInput | string
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxRate?: IntFieldUpdateOperationsInput | number
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyCustomerInput = {
    id?: string
    businessId: string
    localInvoiceNumber?: string | null
    invoiceSequence: number
    invoiceDate: string
    dueDate?: string | null
    description?: string | null
    notes?: string | null
    subtotal: number
    taxAmount: number
    totalAmount: number
    discount?: number
    status?: $Enums.InvoiceStatus
    mode?: $Enums.IntegrationMode
    fbrSubmitted?: boolean
    fbrValidated?: boolean
    submissionTimestamp?: Date | string | null
    fbrInvoiceNumber?: string | null
    locallyGeneratedQRCode?: string | null
    fbrTimestamp?: string | null
    fbrTransmissionId?: string | null
    fbrAcknowledgmentNumber?: string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: boolean
    pdfStoragePath?: string | null
    encryptedData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    localInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceSequence?: IntFieldUpdateOperationsInput | number
    invoiceDate?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    totalAmount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    mode?: EnumIntegrationModeFieldUpdateOperationsInput | $Enums.IntegrationMode
    fbrSubmitted?: BoolFieldUpdateOperationsInput | boolean
    fbrValidated?: BoolFieldUpdateOperationsInput | boolean
    submissionTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    locallyGeneratedQRCode?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTimestamp?: NullableStringFieldUpdateOperationsInput | string | null
    fbrTransmissionId?: NullableStringFieldUpdateOperationsInput | string | null
    fbrAcknowledgmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    fbrResponse?: NullableJsonNullValueInput | InputJsonValue
    pdfGenerated?: BoolFieldUpdateOperationsInput | boolean
    pdfStoragePath?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemCreateManyInvoiceInput = {
    id?: string
    description: string
    hsCode: string
    quantity: number
    unitPrice: number
    totalValue: number
    taxRate: number
    taxAmount: number
    exemptionSRO?: string | null
    unitOfMeasurement: string
  }

  export type InvoiceItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsCode?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalValue?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    exemptionSRO?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasurement?: StringFieldUpdateOperationsInput | string
  }

  export type BulkInvoiceItemCreateManyBatchInput = {
    id?: string
    rowNumber: number
    localId: string
    dataValid?: boolean
    sandboxValidated?: boolean
    sandboxSubmitted?: boolean
    productionSubmitted?: boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: string | null
    invoiceData: JsonNullValueInput | InputJsonValue
    processedAt?: Date | string | null
  }

  export type BulkInvoiceItemUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceItemUncheckedUpdateWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BulkInvoiceItemUncheckedUpdateManyWithoutBatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    rowNumber?: IntFieldUpdateOperationsInput | number
    localId?: StringFieldUpdateOperationsInput | string
    dataValid?: BoolFieldUpdateOperationsInput | boolean
    sandboxValidated?: BoolFieldUpdateOperationsInput | boolean
    sandboxSubmitted?: BoolFieldUpdateOperationsInput | boolean
    productionSubmitted?: BoolFieldUpdateOperationsInput | boolean
    validationErrors?: NullableJsonNullValueInput | InputJsonValue
    sandboxResponse?: NullableJsonNullValueInput | InputJsonValue
    productionResponse?: NullableJsonNullValueInput | InputJsonValue
    fbrInvoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceData?: JsonNullValueInput | InputJsonValue
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BusinessCountOutputTypeDefaultArgs instead
     */
    export type BusinessCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceCountOutputTypeDefaultArgs instead
     */
    export type InvoiceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BulkInvoiceBatchCountOutputTypeDefaultArgs instead
     */
    export type BulkInvoiceBatchCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BulkInvoiceBatchCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSessionDefaultArgs instead
     */
    export type UserSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BusinessDefaultArgs instead
     */
    export type BusinessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceDefaultArgs instead
     */
    export type InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceItemDefaultArgs instead
     */
    export type InvoiceItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BulkInvoiceBatchDefaultArgs instead
     */
    export type BulkInvoiceBatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BulkInvoiceBatchDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BulkInvoiceItemDefaultArgs instead
     */
    export type BulkInvoiceItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BulkInvoiceItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SystemConfigDefaultArgs instead
     */
    export type SystemConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SystemConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogDefaultArgs instead
     */
    export type AuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FBRScenarioDefaultArgs instead
     */
    export type FBRScenarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FBRScenarioDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FBRBusinessScenarioMappingDefaultArgs instead
     */
    export type FBRBusinessScenarioMappingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FBRBusinessScenarioMappingDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}