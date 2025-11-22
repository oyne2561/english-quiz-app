# DDDとモデリング：具体と抽象を行き来する

ドメイン駆動設計（Domain-Driven Design, DDD）とモデリングの学習を通じて、具体と抽象を行き来する思考力を身につけましょう。

## DDDとは？

**ドメイン駆動設計（Domain-Driven Design）**は、ソフトウェア開発において、ビジネスのドメイン（領域）を深く理解し、その知識をコードに反映させる設計手法です。

### 基本原則

1. **ドメインの理解**: ビジネスの本質を理解する
2. **ユビキタス言語**: 開発者とビジネス担当者が共通の言葉を使う
3. **モデルの抽象化**: 複雑な現実を適切に抽象化する
4. **具体と抽象の往復**: 具体例から抽象化し、抽象から具体例を導く

## モデリングを始める前に大切な考え方

コードのテクニック（nullable を減らす、enum をどう使うか…）に入る前に、次の 2 点が特に重要です。

- **ドメインの言葉で考える（ユビキタス言語）**  
  画面項目名や DB カラム名ではなく、「ビジネス側が日常で使っている言葉」でモデルを作ります。用語の意味が曖昧なままクラスやフィールドを増やさないことが重要です。
- **不正な状態を表現できないモデルにする**  
  「この組み合わせは現実では絶対に起きない」という状態を、コード上でも作れないようにします。そのために、非 nullable、値オブジェクト、enum やポリモーフィズムなどを使います。

### nullable について

原則としては **非 nullable を基本にし、本当に必要なところだけ nullable** にします。

- **非 nullable を基本にする理由**
  - ドメイン上「必ず存在するはず」のものが `null` だと、モデルとして嘘をついている状態になります。
  - すべての利用箇所で `if (x != null)` を書くことになり、バグの温床になります。
  - Eric Evans は『Domain-Driven Design』の中で「不変条件（invariant）はオブジェクト生成時に満たされるべき」と述べています。
- **nullable を使ってよいケース**
  - ドメイン的に「本当に *無い* ことがありうる」情報（例: 無料コースの `certificateAvailable`）。
  - それでも、複数の nullable が組み合わさって不正な状態を表せてしまうなら、型の分割を検討します（`FreeCourse` と `PaidCourse` を分けるなど）。

nullable を減らしたいときは、次のような代替パターンも使えます。

- `Optional` / `Option` 型で「ある／ない」を明示する
- 「未決定状態」を表す専用の値オブジェクトを作る
- 状態ごとに型を分ける（サブタイプ・別 data class）

> 参考:  
> - Eric Evans, *Domain-Driven Design*（Addison-Wesley, 2003）第 5 章  
> - Martin Fowler, “Primitive Obsession”（`https://martinfowler.com/bliki/PrimitiveObsession.html`）  
> - Vladimir Khorikov, *Domain Modeling Made Functional*（PragProg, 2017）

### enum（区分値）について

**小さな固定集合のラベルなら enum、状態ごとに振る舞いが違うなら型を分ける**のが基本方針です。

- **enum が向いているケース**
  - 値のパターンが少なく、めったに増えない（通貨コード・会員ステータスなど）。
  - 状態ごとの差はほぼ「表示の違い」だけで、複雑なビジネスロジックが絡まない。
- **enum だけで済ませない方が良いケース**
  - 状態ごとに固有の振る舞いや制約がある（注文ステータスごとの遷移ルールなど）。
  - enum を使うことで、`when(status)` の巨大な分岐があちこちに散らばってしまう。

このような場合は、状態ごとにクラスを分けて共通インターフェースを定義し、**ポリモーフィズムで分岐を吸収する**方が変更に強く、テストもしやすくなります。

> 参考:  
> - Vaughn Vernon, *Implementing Domain-Driven Design*（Addison-Wesley, 2013）  
> - Vladik Khononov, *Learning Domain-Driven Design*（O’Reilly, 2021）

### モデリング前チェックリスト

実際にクラスやフィールドを書く前に、次の順番で考えると失敗が減ります。

1. **これはどんな「言葉」で説明される概念か？**  
   ドメインエキスパートが使っている名詞・動詞を、そのままクラス名・メソッド名にできますか？
2. **同一性が必要か？（ID がいるか？）**  
   ライフサイクルを追跡したいならエンティティ、そうでなければ値オブジェクトにできないかを考えます。
3. **どの組み合わせが「絶対に起きてはいけない状態」か？**  
   その状態を if 文と nullable ではなく、型（サブタイプ・値オブジェクト）で排除できないかを検討します。
4. **このフィールドは本当に「無い」ことがあるか？**  
   無いことがないなら非 nullable にし、コンストラクタで必須にします。
5. **この区分は enum で十分か、それとも状態ごとに責務が違うか？**  
   単なる表示用カテゴリなら enum で十分ですが、状態ごとにロジックが違うなら、型を分けてポリモーフィズムに寄せます。

こうした考え方を踏まえてから、次に出てくる具体例（検索 API や企業のモデリング）に取り組むと、「なぜこの形にしたのか」を自分の頭で説明できるようになります。

## 具体と抽象を行き来する

モデリングの上達には、**具体と抽象を行き来する**ことが重要です。

- **具体 → 抽象**: 複数の具体例から共通パターンを見つけ、抽象化する
- **抽象 → 具体**: 抽象的なモデルから、具体的な実装例を導く

## 例1: 図書館の書籍検索のモデリング

### 具体例から始める

図書館の書籍検索システムを考えてみましょう。実際の使用例：

```
検索クエリ: "英文法"
フィルター: カテゴリ=語学, 出版年=2020年以降
除外: 貸出中の書籍
```

### 抽象化する

具体例から共通パターンを抽出します：

```
書籍検索 = {
  必須入力: クエリ文字列
  オプショナル: {
    filter: { 条件1, 条件2, ... }
    exclude: { 除外条件1, 除外条件2, ... }
  }
}
```

### Kotlinでの実装例

```kotlin
// 抽象的なモデル定義
data class OptionalFilters(
    val filter: Map<String, String>? = null,
    val exclude: Map<String, String>? = null
)

data class SearchInput(
    val query: String,
    val optional: OptionalFilters? = null
)

// 具体例
val searchExample = SearchInput(
    query = "英文法",
    optional = OptionalFilters(
        filter = mapOf("category" to "語学", "publishedYear" to "2020"),
        exclude = mapOf("status" to "貸出中")
    )
)
```

### モデリングのポイント

1. **必須とオプショナルの分離**: 必須の入力とオプショナルな入力を明確に分ける
2. **階層的な構造**: オプショナルの中にさらにfilterとexcludeがある
3. **拡張性**: 新しいフィルター条件を追加しやすい構造

## 例2: オンラインコースのモデリング

### 具体例から始める

オンラインコースには2種類あります：

**有料コースの例**:
- コース名: "実践英文法マスター"
- 作成日: "2020年1月1日"
- 価格: "9800円"
- 受講期間: "6ヶ月"
- 修了証発行: あり

**無料コースの例**:
- コース名: "英語初心者入門"
- 作成日: "2021年3月15日"

### 抽象化する

具体例から共通パターンと違いを見つけます：

```
オンラインコース = {
  コース概要: {
    コース名: String
    作成日: Date
  }
  有料コース情報?: {  // オプショナル（有料コースのみ）
    価格: BigDecimal
    受講期間: Duration
    修了証発行: Boolean
  }
}
```

### Kotlinでの実装例

```kotlin
// 抽象的なモデル定義
interface OnlineCourse {
    val courseProfile: CourseProfile
}

data class CourseProfile(
    val courseName: String,
    val createdDate: LocalDate
)

data class PaidCourseInformation(
    val price: BigDecimal,
    val accessPeriod: Duration,
    val certificateAvailable: Boolean
)

// 有料コース
data class PaidCourse(
    override val courseProfile: CourseProfile,
    val paidCourseInformation: PaidCourseInformation
) : OnlineCourse

// 無料コース
data class FreeCourse(
    override val courseProfile: CourseProfile
) : OnlineCourse

// 具体例
val paidCourse = PaidCourse(
    courseProfile = CourseProfile(
        courseName = "実践英文法マスター",
        createdDate = LocalDate.of(2020, 1, 1)
    ),
    paidCourseInformation = PaidCourseInformation(
        price = BigDecimal("9800"),
        accessPeriod = Duration.ofDays(180),
        certificateAvailable = true
    )
)

val freeCourse = FreeCourse(
    courseProfile = CourseProfile(
        courseName = "英語初心者入門",
        createdDate = LocalDate.of(2021, 3, 15)
    )
)
```

### モデリングのポイント

1. **共通部分の抽出**: コース概要は全コースに共通
2. **interfaceの活用**: 有料コースと無料コースを型安全に表現
3. **オプショナルな情報**: 有料コース情報は有料コースのみが持つ

## モデリングのステップ

### 1. 具体例を集める

複数の具体例を観察し、パターンを見つけます。

### 2. 共通点を見つける

具体例から共通する要素を抽出します。

### 3. 違いを明確にする

具体例間の違いを明確にし、オプショナルな要素を特定します。

### 4. 抽象化する

共通点と違いを基に、抽象的なモデルを設計します。

### 5. 具体例で検証する

抽象化したモデルが、元の具体例を正しく表現できるか確認します。

## モデリングのベストプラクティス

### 1. 不正な状態を表現できないようにする

**悪い例（nullableが多すぎる）**:
```kotlin
data class Order(
    val orderId: String,
    val status: String,  // "pending", "paid", "shipped", "cancelled"
    val paymentDate: LocalDateTime?,  // 支払済みの場合のみ
    val shippingDate: LocalDateTime?,  // 発送済みの場合のみ
    val trackingNumber: String?,  // 発送済みの場合のみ
    val cancellationReason: String?  // キャンセルの場合のみ
)
```

**良い例（型で状態を表現）**:
```kotlin
sealed interface Order {
    val orderId: String
}

data class PendingOrder(
    override val orderId: String
) : Order

data class PaidOrder(
    override val orderId: String,
    val paymentDate: LocalDateTime
) : Order

data class ShippedOrder(
    override val orderId: String,
    val paymentDate: LocalDateTime,
    val shippingDate: LocalDateTime,
    val trackingNumber: String
) : Order

data class CancelledOrder(
    override val orderId: String,
    val cancellationReason: String
) : Order
```

### 2. プリミティブ型の濫用を避ける（値オブジェクト）

**悪い例**:
```kotlin
data class User(
    val email: String,  // バリデーションが散在する
    val age: Int  // 負の数や非現実的な値を防げない
)
```

**良い例**:
```kotlin
@JvmInline
value class Email private constructor(val value: String) {
    companion object {
        fun of(value: String): Email {
            require(value.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))) {
                "Invalid email format"
            }
            return Email(value)
        }
    }
}

@JvmInline
value class Age private constructor(val value: Int) {
    companion object {
        fun of(value: Int): Age {
            require(value in 0..150) { "Age must be between 0 and 150" }
            return Age(value)
        }
    }
}

data class User(
    val email: Email,
    val age: Age
)
```

### 3. ビジネスロジックをドメインモデルに配置する

**悪い例（ロジックが散在）**:
```kotlin
data class Cart(
    val items: List<CartItem>
)

// ビジネスロジックがサービス層に散在
class CartService {
    fun calculateTotal(cart: Cart): BigDecimal {
        return cart.items.sumOf { it.price * it.quantity }
    }
    
    fun canCheckout(cart: Cart): Boolean {
        return cart.items.isNotEmpty()
    }
}
```

**良い例（ドメインモデルがロジックを持つ）**:
```kotlin
data class Cart(
    val items: List<CartItem>
) {
    fun calculateTotal(): BigDecimal {
        return items.sumOf { it.price * it.quantity }
    }
    
    fun canCheckout(): Boolean {
        return items.isNotEmpty()
    }
    
    fun addItem(item: CartItem): Cart {
        return copy(items = items + item)
    }
}
```

### 4. 集約の境界を明確にする

**ポイント**:
- 集約は一貫性の境界
- 集約ルートを通してのみ内部を変更
- 集約間は参照ではなくIDで繋ぐ

```kotlin
// 良い例：注文集約
data class Order(
    val orderId: OrderId,
    val customerId: CustomerId,  // 顧客集約への参照はIDのみ
    val items: List<OrderItem>,
    val status: OrderStatus
) {
    // 集約ルートがビジネスルールを保証
    fun addItem(item: OrderItem): Order {
        require(status == OrderStatus.PENDING) {
            "Can only add items to pending orders"
        }
        return copy(items = items + item)
    }
}
```

## 詳細なモデリングチェックシート

実装前に以下をチェックしましょう：

### Phase 1: ドメイン理解

- [ ] ビジネス側が使っている用語をそのまま使っているか？
- [ ] 技術用語（DB、API など）でドメイン概念を表現していないか？
- [ ] ドメインエキスパートに説明して理解してもらえるか？

### Phase 2: 境界と責務

- [ ] この概念は「エンティティ」か「値オブジェクト」か明確か？
- [ ] 集約の境界は適切か？（大きすぎないか、小さすぎないか）
- [ ] 1つのクラスが複数の責務を持っていないか？

### Phase 3: 型安全性

- [ ] nullableなフィールドは本当に必要か？
- [ ] String、Int などのプリミティブ型をそのまま使っていないか？
- [ ] 不正な状態を型で防げているか？
- [ ] enumで十分か、それとも型を分けるべきか？

### Phase 4: 不変条件

- [ ] オブジェクト生成時に不変条件をチェックしているか？
- [ ] publicなsetterを避けて、不変条件を保護しているか？
- [ ] 状態変更は新しいオブジェクトを返すか、明示的なメソッドを通すか？

### Phase 5: テスタビリティ

- [ ] 各クラスを単独でテストできるか？
- [ ] 複雑な依存関係を持っていないか？
- [ ] テストケースを書きやすい設計か？

### Phase 6: 拡張性

- [ ] 新しい要件が追加された時、影響範囲は限定的か？
- [ ] Open-Closed原則に従っているか？
- [ ] 新しいバリエーションを追加しやすいか？

## よくある間違いとその対処法

### 間違い1: 何でもnullableにする

**症状**:
```kotlin
data class Student(
    val name: String?,
    val studentId: String?,
    val email: String?,
    val phoneNumber: String?
)
```

**問題点**:
- 必須フィールドが明確でない
- null チェックが至る所に必要
- 不正な状態（全部nullなど）を作れてしまう

**対処法**:
```kotlin
data class Student(
    val name: String,  // 必須
    val studentId: StudentId,  // 必須、値オブジェクト
    val email: Email,  // 必須、値オブジェクト
    val phoneNumber: PhoneNumber?  // 本当にオプショナル
)
```

### 間違い2: 巨大なGodオブジェクト

**症状**:
```kotlin
data class User(
    // ユーザー基本情報
    val userId: String,
    val name: String,
    val email: String,
    // 住所情報
    val postalCode: String?,
    val prefecture: String?,
    val city: String?,
    val address: String?,
    // 決済情報
    val creditCardNumber: String?,
    val expiryDate: String?,
    // ...さらに20個のフィールド
)
```

**問題点**:
- 責務が多すぎる
- 変更の影響範囲が大きい
- テストが困難

**対処法**:
```kotlin
data class User(
    val userId: UserId,
    val profile: UserProfile,
    val address: Address?,
    val paymentMethod: PaymentMethod?
)

data class UserProfile(
    val name: String,
    val email: Email
)

data class Address(
    val postalCode: PostalCode,
    val prefecture: Prefecture,
    val city: String,
    val streetAddress: String
)
```

### 間違い3: ビジネスロジックが散在

**症状**:
```kotlin
// ドメインモデル
data class Order(val items: List<OrderItem>, val status: String)

// コントローラー
fun placeOrder(order: Order) {
    if (order.items.isEmpty()) throw Exception("Empty order")
    if (order.status != "PENDING") throw Exception("Invalid status")
    // ...
}

// サービス
fun calculateTotal(order: Order): BigDecimal {
    return order.items.sumOf { it.price * it.quantity }
}
```

**問題点**:
- ビジネスルールが様々な場所に散在
- 重複したチェックが発生
- ドメイン知識がコードに表現されていない

**対処法**:
```kotlin
sealed interface OrderStatus
object Pending : OrderStatus
object Confirmed : OrderStatus
object Shipped : OrderStatus

data class Order private constructor(
    val items: List<OrderItem>,
    val status: OrderStatus
) {
    companion object {
        fun create(items: List<OrderItem>): Order {
            require(items.isNotEmpty()) { "Order must have at least one item" }
            return Order(items, Pending)
        }
    }
    
    fun calculateTotal(): BigDecimal {
        return items.sumOf { it.price * it.quantity }
    }
    
    fun confirm(): Order {
        require(status is Pending) { "Can only confirm pending orders" }
        return copy(status = Confirmed)
    }
}
```

### 間違い4: DTOとドメインモデルの混同

**症状**:
```kotlin
// API のリクエストボディをそのままドメインモデルに
data class CreateUserRequest(
    val name: String,
    val email: String,
    val age: Int,
    val acceptedTerms: Boolean
)

fun createUser(request: CreateUserRequest) {
    // リクエストをそのまま使用
    userRepository.save(request)
}
```

**問題点**:
- API の都合でドメインモデルが汚染される
- バリデーションロジックが不明確
- ドメインの不変条件が保証されない

**対処法**:
```kotlin
// DTO（データ転送用）
data class CreateUserRequest(
    val name: String,
    val email: String,
    val age: Int,
    val acceptedTerms: Boolean
)

// ドメインモデル（ビジネスロジック用）
data class User private constructor(
    val userId: UserId,
    val name: String,
    val email: Email,
    val age: Age
) {
    companion object {
        fun create(name: String, emailString: String, ageValue: Int): User {
            require(name.isNotBlank()) { "Name is required" }
            val email = Email.of(emailString)
            val age = Age.of(ageValue)
            return User(UserId.generate(), name, email, age)
        }
    }
}

// ユースケース層で変換
fun createUser(request: CreateUserRequest): User {
    require(request.acceptedTerms) { "Must accept terms" }
    return User.create(request.name, request.email, request.age)
}
```

## 練習問題

### 問題1: ユーザー管理システム

**具体例**:
- 一般ユーザー: 名前、メールアドレス、パスワード
- 管理者ユーザー: 名前、メールアドレス、パスワード、権限レベル

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

### 問題2: 商品カタログ

**具体例**:
- 物理商品: 名前、価格、在庫数、重量
- デジタル商品: 名前、価格、ダウンロードURL

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

### 問題3: 予約システム

**具体例**:
- 確定予約: 予約ID、予約者名、予約日時、確定日時
- 仮予約: 予約ID、予約者名、予約日時、有効期限
- キャンセル予約: 予約ID、予約者名、予約日時、キャンセル理由、キャンセル日時

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

### 問題4: 通知システム

**具体例**:
- メール通知: 宛先、件名、本文
- SMS通知: 電話番号、本文
- プッシュ通知: デバイストークン、タイトル、本文、バッジ数

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

### 問題5: イベント参加

**具体例**:
- 一般参加: 参加者名、メールアドレス、参加日
- VIP参加: 参加者名、メールアドレス、参加日、特典内容、専用ラウンジ利用可
- オンライン参加: 参加者名、メールアドレス、参加日、配信URL

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

### 問題6: 配送方法

**具体例**:
- 通常配送: 配送先住所、配送料（一律500円）、到着予定日
- お急ぎ便: 配送先住所、配送料（1000円）、時間帯指定
- 店舗受取: 受取店舗、受取予定日（配送料無料）

**抽象化**: 上記の具体例から抽象的なモデルを設計してください。

## 練習問題の回答

### 問題1の回答: ユーザー管理システム

**共通点を見つける**:
- 名前、メールアドレス、パスワードは全ユーザーに共通
- 権限レベルは管理者ユーザーのみが持つ

**抽象化**:
```
ユーザー = {
  名前: String
  メールアドレス: String
  パスワード: String
  権限レベル?: String  // オプショナル（管理者のみ）
}
```

**Kotlinでの実装例**:

```kotlin
// 抽象的なモデル定義
interface User {
    val name: String
    val email: String
    val passwordHash: String
}

// 一般ユーザー
data class RegularUser(
    override val name: String,
    override val email: String,
    override val passwordHash: String
) : User

// 管理者ユーザー
data class AdminUser(
    override val name: String,
    override val email: String,
    override val passwordHash: String,
    val permissionLevel: String
) : User

// 具体例
val regularUser = RegularUser(
    name = "田中太郎",
    email = "tanaka@example.com",
    passwordHash = "hashed_password_123"
)

val adminUser = AdminUser(
    name = "佐藤花子",
    email = "sato@example.com",
    passwordHash = "hashed_password_456",
    permissionLevel = "super_admin"
)
```

**モデリングのポイント**:
- interfaceを使うことで、一般ユーザーと管理者ユーザーを型安全に区別
- 共通の属性（名前、メール、パスワード）をinterfaceに定義
- 管理者のみが持つ属性（権限レベル）をAdminUserに追加
- 各ユーザータイプを独立したdata classとして実装し、拡張性を確保

### 問題2の回答: 商品カタログ

**共通点を見つける**:
- 名前と価格は全商品に共通
- 在庫数と重量は物理商品のみが持つ
- ダウンロードURLはデジタル商品のみが持つ

**抽象化**:
```
商品 = {
  名前: String
  価格: BigDecimal
  在庫数?: Int  // オプショナル（物理商品のみ）
  重量?: BigDecimal  // オプショナル（物理商品のみ）
  ダウンロードURL?: String  // オプショナル（デジタル商品のみ）
}
```

**Kotlinでの実装例**:

```kotlin
// 抽象的なモデル定義
interface Product {
    val name: String
    val price: BigDecimal
}

// 物理商品
data class PhysicalProduct(
    override val name: String,
    override val price: BigDecimal,
    val stockQuantity: Int,
    val weight: BigDecimal
) : Product

// デジタル商品
data class DigitalProduct(
    override val name: String,
    override val price: BigDecimal,
    val downloadUrl: String
) : Product

// 具体例
val physicalProduct = PhysicalProduct(
    name = "ノートPC",
    price = BigDecimal("99800"),
    stockQuantity = 50,
    weight = BigDecimal("1.5")
)

val digitalProduct = DigitalProduct(
    name = "電子書籍",
    price = BigDecimal("1980"),
    downloadUrl = "https://example.com/ebooks/book123.pdf"
)
```

**モデリングのポイント**:
- interfaceを使うことで、物理商品とデジタル商品を型安全に区別
- 共通の属性（名前、価格）をinterfaceに定義
- 各商品型に固有の属性を各data classに定義
- 物理商品は在庫数と重量を持ち、デジタル商品はダウンロードURLを持つ
- 各商品タイプを独立したdata classとして実装し、不正な状態を防ぐ

### 問題3の回答: 予約システム

**共通点を見つける**:
- 予約ID、予約者名、予約日時は全予約に共通
- 確定日時は確定予約のみ
- 有効期限は仮予約のみ
- キャンセル理由とキャンセル日時はキャンセル予約のみ

**抽象化**:
```
予約 = {
  予約ID: String
  予約者名: String
  予約日時: DateTime
  確定日時?: DateTime  // 確定予約のみ
  有効期限?: DateTime  // 仮予約のみ
  キャンセル理由?: String  // キャンセル予約のみ
  キャンセル日時?: DateTime  // キャンセル予約のみ
}
```

**Kotlinでの実装例**:

```kotlin
sealed interface Reservation {
    val reservationId: String
    val guestName: String
    val reservationDateTime: LocalDateTime
}

data class ConfirmedReservation(
    override val reservationId: String,
    override val guestName: String,
    override val reservationDateTime: LocalDateTime,
    val confirmedAt: LocalDateTime
) : Reservation

data class TentativeReservation(
    override val reservationId: String,
    override val guestName: String,
    override val reservationDateTime: LocalDateTime,
    val expiresAt: LocalDateTime
) : Reservation {
    fun confirm(confirmedAt: LocalDateTime): ConfirmedReservation {
        require(confirmedAt <= expiresAt) { "Cannot confirm after expiration" }
        return ConfirmedReservation(
            reservationId, guestName, reservationDateTime, confirmedAt
        )
    }
}

data class CancelledReservation(
    override val reservationId: String,
    override val guestName: String,
    override val reservationDateTime: LocalDateTime,
    val cancellationReason: String,
    val cancelledAt: LocalDateTime
) : Reservation

// 具体例
val confirmed = ConfirmedReservation(
    reservationId = "R001",
    guestName = "山田太郎",
    reservationDateTime = LocalDateTime.of(2024, 12, 25, 18, 0),
    confirmedAt = LocalDateTime.now()
)

val tentative = TentativeReservation(
    reservationId = "R002",
    guestName = "佐藤花子",
    reservationDateTime = LocalDateTime.of(2024, 12, 26, 19, 0),
    expiresAt = LocalDateTime.now().plusHours(24)
)
```

**モデリングのポイント**:
- sealed interfaceで予約の状態を型で表現
- 状態ごとに持つべき情報が明確
- 状態遷移（仮予約→確定予約）をメソッドで表現
- 不正な状態（確定日時があるのに仮予約など）を作れない

### 問題4の回答: 通知システム

**共通点を見つける**:
- 本文は全通知に共通
- 宛先・件名はメール通知のみ
- 電話番号はSMS通知のみ
- デバイストークン・タイトル・バッジ数はプッシュ通知のみ

**Kotlinでの実装例**:

```kotlin
sealed interface Notification {
    val message: String
}

data class EmailNotification(
    override val message: String,
    val to: Email,
    val subject: String
) : Notification

data class SmsNotification(
    override val message: String,
    val phoneNumber: PhoneNumber
) : Notification

data class PushNotification(
    override val message: String,
    val deviceToken: String,
    val title: String,
    val badgeCount: Int
) : Notification

// 具体例
val email = EmailNotification(
    message = "ご注文を受け付けました",
    to = Email.of("customer@example.com"),
    subject = "注文確認"
)

val sms = SmsNotification(
    message = "認証コード: 123456",
    phoneNumber = PhoneNumber.of("090-1234-5678")
)

val push = PushNotification(
    message = "新しいメッセージがあります",
    deviceToken = "abc123xyz",
    title = "メッセージ通知",
    badgeCount = 3
)
```

**モデリングのポイント**:
- sealed interfaceで通知の種類を型で表現
- 各通知方法に必要な情報のみを持つ
- 送信方法に応じた実装を追加しやすい構造

### 問題5の回答: イベント参加

**共通点を見つける**:
- 参加者名、メールアドレス、参加日は全参加者に共通
- 特典内容と専用ラウンジ利用はVIP参加のみ
- 配信URLはオンライン参加のみ

**Kotlinでの実装例**:

```kotlin
sealed interface EventParticipation {
    val participantName: String
    val email: Email
    val participationDate: LocalDate
}

data class RegularParticipation(
    override val participantName: String,
    override val email: Email,
    override val participationDate: LocalDate
) : EventParticipation

data class VipParticipation(
    override val participantName: String,
    override val email: Email,
    override val participationDate: LocalDate,
    val benefits: List<String>,
    val loungeAccessible: Boolean
) : EventParticipation

data class OnlineParticipation(
    override val participantName: String,
    override val email: Email,
    override val participationDate: LocalDate,
    val streamingUrl: String
) : EventParticipation

// 具体例
val regular = RegularParticipation(
    participantName = "田中一郎",
    email = Email.of("tanaka@example.com"),
    participationDate = LocalDate.of(2024, 12, 1)
)

val vip = VipParticipation(
    participantName = "鈴木二郎",
    email = Email.of("suzuki@example.com"),
    participationDate = LocalDate.of(2024, 12, 1),
    benefits = listOf("優先入場", "記念品", "懇親会参加"),
    loungeAccessible = true
)

val online = OnlineParticipation(
    participantName = "佐藤三郎",
    email = Email.of("sato@example.com"),
    participationDate = LocalDate.of(2024, 12, 1),
    streamingUrl = "https://stream.example.com/event/123"
)
```

**モデリングのポイント**:
- 参加形態によって提供されるサービスが異なることを型で表現
- VIP参加者の特典を明確に定義
- オンライン参加特有の情報を分離

### 問題6の回答: 配送方法

**共通点を見つける**:
- 全配送方法に到着に関する情報がある
- 配送先住所は通常配送とお急ぎ便のみ
- 受取店舗は店舗受取のみ
- 配送料と時間帯指定の有無が異なる

**Kotlinでの実装例**:

```kotlin
sealed interface DeliveryMethod {
    fun calculateFee(): BigDecimal
}

data class StandardDelivery(
    val address: Address,
    val estimatedArrivalDate: LocalDate
) : DeliveryMethod {
    override fun calculateFee(): BigDecimal = BigDecimal("500")
}

data class ExpressDelivery(
    val address: Address,
    val timeSlot: TimeSlot
) : DeliveryMethod {
    override fun calculateFee(): BigDecimal = BigDecimal("1000")
}

data class StorePickup(
    val store: Store,
    val pickupDate: LocalDate
) : DeliveryMethod {
    override fun calculateFee(): BigDecimal = BigDecimal.ZERO
}

enum class TimeSlot {
    MORNING,      // 午前中
    AFTERNOON,    // 12-14時
    EVENING,      // 14-16時
    NIGHT         // 18-20時
}

// 具体例
val standard = StandardDelivery(
    address = Address.of("東京都渋谷区..."),
    estimatedArrivalDate = LocalDate.now().plusDays(3)
)

val express = ExpressDelivery(
    address = Address.of("東京都新宿区..."),
    timeSlot = TimeSlot.MORNING
)

val pickup = StorePickup(
    store = Store(storeId = "S001", name = "渋谷店"),
    pickupDate = LocalDate.now().plusDays(1)
)

// 配送料の計算
println("通常配送料: ${standard.calculateFee()}円")  // 500円
println("お急ぎ便配送料: ${express.calculateFee()}円")  // 1000円
println("店舗受取配送料: ${pickup.calculateFee()}円")  // 0円
```

**モデリングのポイント**:
- 配送方法ごとに異なる配送料をメソッドで表現
- 店舗受取は配送先住所を持たない（不要な情報を持たせない）
- お急ぎ便の時間帯指定をenumで型安全に表現
- ポリモーフィズムで配送料計算を統一的に扱える

## 実践的なケーススタディ

### ケーススタディ1: ブログシステムのリファクタリング

**Before（問題のあるコード）**:

```kotlin
data class BlogPost(
    val id: String,
    val title: String,
    val content: String,
    val status: String,  // "draft", "published", "archived"
    val publishedDate: LocalDateTime?,
    val authorId: String,
    val tags: List<String>?,
    val viewCount: Int,
    val archiveReason: String?
)
```

**問題点**:
1. statusが文字列なので、タイポの可能性
2. publishedDateがnullableだが、公開済みなら必須のはず
3. archiveReasonもnullableだが、アーカイブ済みなら必須のはず
4. statusとnullableフィールドの組み合わせで不正な状態を作れる

**After（改善後のコード）**:

```kotlin
sealed interface BlogPost {
    val id: BlogPostId
    val title: String
    val content: String
    val authorId: AuthorId
    val tags: List<Tag>
}

data class DraftPost(
    override val id: BlogPostId,
    override val title: String,
    override val content: String,
    override val authorId: AuthorId,
    override val tags: List<Tag>,
    val lastModified: LocalDateTime
) : BlogPost {
    fun publish(publishDate: LocalDateTime): PublishedPost {
        require(title.isNotBlank()) { "Title cannot be blank" }
        require(content.isNotBlank()) { "Content cannot be blank" }
        return PublishedPost(
            id, title, content, authorId, tags, publishDate, viewCount = 0
        )
    }
}

data class PublishedPost(
    override val id: BlogPostId,
    override val title: String,
    override val content: String,
    override val authorId: AuthorId,
    override val tags: List<Tag>,
    val publishedDate: LocalDateTime,
    val viewCount: Int
) : BlogPost {
    fun incrementViewCount(): PublishedPost = copy(viewCount = viewCount + 1)
    
    fun archive(reason: String): ArchivedPost {
        require(reason.isNotBlank()) { "Archive reason is required" }
        return ArchivedPost(id, title, content, authorId, tags, publishedDate, reason, LocalDateTime.now())
    }
}

data class ArchivedPost(
    override val id: BlogPostId,
    override val title: String,
    override val content: String,
    override val authorId: AuthorId,
    override val tags: List<Tag>,
    val publishedDate: LocalDateTime,
    val archiveReason: String,
    val archivedAt: LocalDateTime
) : BlogPost
```

**改善点**:
- 状態ごとにクラスを分割し、不正な状態を型で防ぐ
- 状態遷移をメソッドで明示的に表現
- 各状態で必要な情報のみを持つ
- ビジネスルール（公開前のバリデーション等）をメソッド内に配置

### ケーススタディ2: ECサイトの注文処理

**Before（問題のあるコード）**:

```kotlin
data class Order(
    val orderId: String,
    val customerId: String,
    val items: MutableList<OrderItem>,
    val totalAmount: BigDecimal,
    val status: String,
    val shippingAddress: String?,
    val paymentMethod: String?,
    val isPaid: Boolean,
    val isShipped: Boolean,
    val trackingNumber: String?
)

// サービス層にビジネスロジックが散在
class OrderService {
    fun placeOrder(order: Order): Order {
        if (order.items.isEmpty()) throw Exception("Empty order")
        if (order.shippingAddress == null) throw Exception("No address")
        order.status = "PLACED"
        order.totalAmount = calculateTotal(order)
        return order
    }
    
    private fun calculateTotal(order: Order): BigDecimal {
        return order.items.sumOf { it.price * it.quantity }
    }
}
```

**After（改善後のコード）**:

```kotlin
@JvmInline
value class OrderId(val value: String)

@JvmInline
value class CustomerId(val value: String)

data class OrderItem(
    val productId: ProductId,
    val productName: String,
    val price: Money,
    val quantity: Quantity
) {
    fun subtotal(): Money = price * quantity.value
}

sealed interface Order {
    val orderId: OrderId
    val customerId: CustomerId
    val items: List<OrderItem>
    
    fun calculateTotal(): Money = items.fold(Money.ZERO) { acc, item -> 
        acc + item.subtotal() 
    }
}

data class PendingOrder private constructor(
    override val orderId: OrderId,
    override val customerId: CustomerId,
    override val items: List<OrderItem>
) : Order {
    companion object {
        fun create(customerId: CustomerId, items: List<OrderItem>): PendingOrder {
            require(items.isNotEmpty()) { "Order must contain at least one item" }
            return PendingOrder(OrderId.generate(), customerId, items)
        }
    }
    
    fun addItem(item: OrderItem): PendingOrder {
        return copy(items = items + item)
    }
    
    fun place(shippingAddress: Address, paymentMethod: PaymentMethod): PlacedOrder {
        return PlacedOrder(orderId, customerId, items, shippingAddress, paymentMethod)
    }
}

data class PlacedOrder(
    override val orderId: OrderId,
    override val customerId: CustomerId,
    override val items: List<OrderItem>,
    val shippingAddress: Address,
    val paymentMethod: PaymentMethod
) : Order {
    fun pay(): PaidOrder {
        return PaidOrder(orderId, customerId, items, shippingAddress, paymentMethod, LocalDateTime.now())
    }
}

data class PaidOrder(
    override val orderId: OrderId,
    override val customerId: CustomerId,
    override val items: List<OrderItem>,
    val shippingAddress: Address,
    val paymentMethod: PaymentMethod,
    val paidAt: LocalDateTime
) : Order {
    fun ship(trackingNumber: TrackingNumber): ShippedOrder {
        return ShippedOrder(
            orderId, customerId, items, shippingAddress, 
            paymentMethod, paidAt, trackingNumber, LocalDateTime.now()
        )
    }
}

data class ShippedOrder(
    override val orderId: OrderId,
    override val customerId: CustomerId,
    override val items: List<OrderItem>,
    val shippingAddress: Address,
    val paymentMethod: PaymentMethod,
    val paidAt: LocalDateTime,
    val trackingNumber: TrackingNumber,
    val shippedAt: LocalDateTime
) : Order
```

**改善点**:
- 注文の状態遷移を型で表現（Pending → Placed → Paid → Shipped）
- 各状態で必要な情報のみを持つ（支払前は支払日時を持たない等）
- 状態遷移をメソッドで明示的に表現し、不正な遷移を防ぐ
- ビジネスロジック（金額計算等）をドメインモデルに配置
- 値オブジェクト（Money、Quantity等）でプリミティブ型の濫用を回避

## モデリング学習パス

### レベル1: 基礎理解（1-2週間）

**目標**: 基本的な概念を理解する

1. **ユビキタス言語の重要性を理解**
   - 技術用語とドメイン用語の違いを意識する
   - ビジネス側の言葉でモデルを考える練習

2. **nullableを減らす練習**
   - 既存のコードでnullableなフィールドを見つける
   - 本当にnullableが必要か問いかける
   - 値オブジェクトや型分割で置き換える

3. **簡単な例題を解く**
   - 問題1-2から始める
   - 自分で考えた後、回答と比較
   - なぜその設計が良いのか言語化する

### レベル2: 実践練習（2-4週間）

**目標**: パターンを身につける

1. **より複雑な例題に挑戦**
   - 問題3-6に取り組む
   - 複数の解決策を考え、比較する
   - トレードオフを理解する

2. **よくある間違いを学ぶ**
   - 間違い例を見て、なぜ問題なのか理解する
   - 自分のコードで同じ間違いをしていないか確認
   - リファクタリングの練習

3. **チェックリストを使う**
   - コードを書く前にチェックリストを確認
   - レビュー時にチェックリストで検証
   - 自分なりのチェック項目を追加

### レベル3: 応用・深化（4週間以降）

**目標**: 実務で適用できるレベルに

1. **実際のコードをリファクタリング**
   - 既存のプロジェクトから改善箇所を見つける
   - ケーススタディを参考にリファクタリング
   - Before/Afterを比較し、改善点を文書化

2. **チームでのモデリング**
   - ドメインエキスパートと対話しながらモデリング
   - イベントストーミングなどの手法を試す
   - チーム内でモデルをレビューし合う

3. **継続的な改善**
   - 新しい要件が来たときにモデルを見直す
   - リファクタリングのタイミングを見極める
   - パターンライブラリを構築する

### 日々の練習方法

**毎日10分の練習**:
1. 身の回りの概念を1つ選ぶ（図書館、レストラン、病院など）
2. その概念をモデリングしてみる
3. 不正な状態を作れないか確認
4. 改善案を考える

**週に1回の振り返り**:
1. 書いたコードを見直す
2. チェックリストで評価
3. 改善できる点をメモ
4. 次週の目標を設定

## 参考資料とさらなる学習

### 書籍

1. **Eric Evans『Domain-Driven Design』（エリック・エヴァンスのドメイン駆動設計）**
   - DDDの原典
   - 戦略的設計と戦術的設計の両方をカバー

2. **Vaughn Vernon『Implementing Domain-Driven Design』**
   - より実践的なDDDの解説
   - コード例が豊富

3. **Vladik Khononov『Learning Domain-Driven Design』**
   - 最新のDDD解説書
   - モダンな実践例が充実

### オンラインリソース

1. **Martin Fowlerのブログ**
   - `https://martinfowler.com/`
   - 多くのパターンとベストプラクティス

2. **DDD Community**
   - `https://github.com/ddd-crew`
   - モデリングツールやテンプレート

## まとめ

- **具体から抽象へ**: 複数の具体例から共通パターンを抽出
- **抽象から具体へ**: 抽象的なモデルから具体的な実装を導く
- **往復する**: 具体と抽象を行き来することで、理解が深まる
- **型安全**: Kotlinのinterfaceやdata classを活用して型安全なモデルを設計
- **継続的な改善**: モデリングは一度で完璧にはならない。継続的に改善する

モデリングは練習によって上達します。日常的に具体例を観察し、抽象化する習慣を身につけましょう。

**次のステップ**:
1. レベル1の練習問題（問題1-2）を自力で解いてみる
2. チェックリストを印刷して、コードレビュー時に使う
3. 既存のコードから改善箇所を1つ見つけてリファクタリングする
4. 週1回、学んだことを振り返る時間を作る

