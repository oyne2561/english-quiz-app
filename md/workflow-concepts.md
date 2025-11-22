# Core Concepts - Argo Workflows

**出典ページ:** https://argo-workflows.readthedocs.io/en/latest/workflow-concepts/
**ページタイトル:** Core Concepts

---

## 例題1

**英文:**
The Workflow is the most important resource in Argo Workflows and serves two important functions.

**文構造:**
- **SVC構造** (Subject + Verb + Complement)
  - **S (Subject)**: The Workflow
  - **V (Verb)**: is
  - **C (Complement)**: the most important resource in Argo Workflows and serves two important functions
    - **名詞句**: the most important resource
    - **前置詞句**: in Argo Workflows
    - **接続詞**: and
    - **動詞句**: serves two important functions

**全文の日本語訳:**
Workflowは、Argo Workflowsにおいて最も重要なリソースであり、2つの重要な機能を果たします。

**部分的な日本語訳:**
- The Workflow: Workflow
- is: ～である
- the most important resource: 最も重要なリソース
- in Argo Workflows: Argo Workflowsにおいて
- and: そして
- serves: 果たす
- two important functions: 2つの重要な機能

**重要単語の解説:**
- **workflow**: ワークフロー。一連の処理手順やタスクの流れを表す。
- **resource**: リソース。システムが管理する対象。Kubernetesでは、クラスタ内のエンティティを表す。
- **important**: 重要な。価値や意義が大きい、という意味。
- **function**: 機能。システムやオブジェクトが持つ役割や働き。
- **serve**: 果たす、提供する。役割を担うこと。

**文法ポイント:**
- **SVC構造**: 主語 + be動詞 + 補語の構造。主語の性質や状態を説明する。
- **最上級**: "the most important"は最上級で、「最も重要な」という意味。
- **andによる並列**: "is...and serves"は、andで接続された2つの述語。

---

## 例題2

**英文:**
It defines the workflow to be executed.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: It
  - **V (Verb)**: defines
  - **O (Object)**: the workflow to be executed
    - **名詞**: the workflow
    - **不定詞句**: to be executed（名詞を修飾）

**全文の日本語訳:**
それは実行されるワークフローを定義します。

**部分的な日本語訳:**
- It: それは
- defines: 定義する
- the workflow: ワークフロー
- to be executed: 実行される（不定詞の受動態）

**重要単語の解説:**
- **define**: 定義する。何かを明確に規定すること。
- **execute**: 実行する。プログラムやタスクを実際に動作させること。

**文法ポイント:**
- **不定詞の受動態**: "to be executed"は不定詞の受動態で、「実行される」という意味。名詞"workflow"を修飾している。

---

## 例題3

**英文:**
It stores the state of the workflow.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: It
  - **V (Verb)**: stores
  - **O (Object)**: the state of the workflow
    - **名詞**: the state
    - **前置詞句**: of the workflow

**全文の日本語訳:**
それはワークフローの状態を保存します。

**部分的な日本語訳:**
- It: それは
- stores: 保存する
- the state: 状態
- of the workflow: ワークフローの

**重要単語の解説:**
- **store**: 保存する。データや情報を記憶すること。
- **state**: 状態。ある時点での状況。

**文法ポイント:**
- **前置詞句による修飾**: "of the workflow"は、"state"を修飾する前置詞句。

---

## 例題4

**英文:**
Because of these dual responsibilities, a `Workflow` should be treated as a "live" object.

**文構造:**
- **前置詞句**: Because of these dual responsibilities（理由を表す）
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: a `Workflow`
  - **V (Verb)**: should be treated
  - **前置詞句**: as a "live" object

**全文の日本語訳:**
これらの二重の責任のため、`Workflow`は「ライブ」オブジェクトとして扱われるべきです。

**部分的な日本語訳:**
- Because of: ～のため（理由を表す前置詞句）
- these dual responsibilities: これらの二重の責任
- a `Workflow`: Workflow
- should be treated: 扱われるべきである（助動詞 + 受動態）
- as a "live" object: 「ライブ」オブジェクトとして

**重要単語の解説:**
- **because of**: ～のため。理由を表す前置詞句。
- **dual**: 二重の。2つの、という意味。
- **responsibility**: 責任。役割や義務。
- **treat**: 扱う。何かを特定の方法で処理すること。
- **live**: ライブの。実行中の、動的な、という意味。
- **object**: オブジェクト。データ構造やエンティティ。

**文法ポイント:**
- **前置詞句による理由**: "Because of these dual responsibilities"は、理由を表す前置詞句。
- **助動詞 + 受動態**: "should be treated"は、助動詞と受動態の組み合わせで、「扱われるべきである」という意味。

---

## 例題5

**英文:**
The workflow to be executed is defined in the Workflow.spec field.

**文構造:**
- **受動態** (Passive Voice)
  - **S (Subject)**: The workflow to be executed
    - **名詞**: The workflow
    - **不定詞句**: to be executed（名詞を修飾）
  - **V (Verb)**: is defined
  - **前置詞句**: in the Workflow.spec field

**全文の日本語訳:**
実行されるワークフローは、Workflow.specフィールドで定義されます。

**部分的な日本語訳:**
- The workflow: ワークフロー
- to be executed: 実行される（不定詞の受動態）
- is defined: 定義される（受動態）
- in the Workflow.spec field: Workflow.specフィールドで

**重要単語の解説:**
- **field**: フィールド。データ構造の1つの要素や属性。
- **spec**: specificationの略。仕様や定義。

**文法ポイント:**
- **受動態**: "is defined"は受動態で、「定義される」という意味。
- **不定詞の受動態**: "to be executed"は不定詞の受動態で、名詞"workflow"を修飾している。

---

## 例題6

**英文:**
The core structure of a Workflow spec is a list of templates and an `entrypoint`.

**文構造:**
- **SVC構造** (Subject + Verb + Complement)
  - **S (Subject)**: The core structure of a Workflow spec
    - **名詞句**: The core structure
    - **前置詞句**: of a Workflow spec
  - **V (Verb)**: is
  - **C (Complement)**: a list of templates and an `entrypoint`
    - **名詞句**: a list of templates
    - **接続詞**: and
    - **名詞**: an `entrypoint`

**全文の日本語訳:**
Workflow specのコア構造は、テンプレートのリストと`entrypoint`です。

**部分的な日本語訳:**
- The core structure: コア構造
- of a Workflow spec: Workflow specの
- is: ～である
- a list of templates: テンプレートのリスト
- and: と
- an `entrypoint`: entrypoint

**重要単語の解説:**
- **core**: コア。中心的な、核となる、という意味。
- **structure**: 構造。要素の配置や関係性。
- **list**: リスト。複数の項目を列挙したもの。
- **template**: テンプレート。再利用可能な設計やパターン。
- **entrypoint**: エントリーポイント。プログラムやワークフローの実行開始点。

**文法ポイント:**
- **SVC構造**: 主語 + be動詞 + 補語の構造。
- **前置詞句による修飾**: "of a Workflow spec"は、"structure"を修飾する前置詞句。
- **andによる並列**: "a list of templates and an `entrypoint`"は、andで接続された2つの名詞句。

---

## 例題7

**英文:**
Templates can be loosely thought of as "functions": they define instructions to be executed.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: Templates
  - **V (Verb)**: can be thought of
  - **副詞**: loosely
  - **前置詞句**: as "functions"
  - **コロン**: :
  - **独立節**: they define instructions to be executed
    - **S**: they
    - **V**: define
    - **O**: instructions to be executed

**全文の日本語訳:**
テンプレートは、大まかに「関数」として考えられます：それらは実行される命令を定義します。

**部分的な日本語訳:**
- Templates: テンプレート（複数形）
- can be thought of: 考えられる（助動詞 + 受動態）
- loosely: 大まかに
- as "functions": 「関数」として
- they: それらは
- define: 定義する
- instructions: 命令
- to be executed: 実行される（不定詞の受動態）

**重要単語の解説:**
- **loosely**: 大まかに。厳密でなく、という意味。
- **think of**: ～として考える。何かを別のものとして見なすこと。
- **function**: 関数。プログラミングで、入力を受け取り出力を返す処理の単位。
- **instruction**: 命令。実行すべき処理や手順。

**文法ポイント:**
- **助動詞 + 受動態**: "can be thought of"は、助動詞と受動態の組み合わせ。
- **副詞の位置**: "loosely"は動詞句を修飾する副詞。
- **コロン**: コロン（:）は、前の文を説明する文を導く。
- **不定詞の受動態**: "to be executed"は不定詞の受動態で、名詞"instructions"を修飾している。

---

## 例題8

**英文:**
The `entrypoint` field defines what the "main" function will be – that is, the template that will be executed first.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: The `entrypoint` field
  - **V (Verb)**: defines
  - **O (Object)**: what the "main" function will be – that is, the template that will be executed first
    - **名詞節**: what the "main" function will be
    - **挿入句**: that is
    - **名詞句**: the template that will be executed first
      - **関係代名詞節**: that will be executed first

**全文の日本語訳:**
`entrypoint`フィールドは、「メイン」関数が何になるかを定義します – つまり、最初に実行されるテンプレートです。

**部分的な日本語訳:**
- The `entrypoint` field: entrypointフィールド
- defines: 定義する
- what the "main" function will be: 「メイン」関数が何になるか（名詞節）
- that is: つまり
- the template: テンプレート
- that will be executed first: 最初に実行される（関係代名詞節）

**重要単語の解説:**
- **main**: メインの。主要な、という意味。
- **first**: 最初の。最初に、という意味。

**文法ポイント:**
- **名詞節**: "what the "main" function will be"は名詞節で、動詞"defines"の目的語として機能している。
- **挿入句**: "that is"は挿入句で、説明を追加している。
- **関係代名詞節**: "that will be executed first"は関係代名詞節で、"template"を修飾している。

---

## 例題9

**英文:**
There are 9 types of templates, divided into two different categories.

**文構造:**
- **There構文** (There + be動詞)
  - **There**: There
  - **V (Verb)**: are
  - **S (Subject)**: 9 types of templates
  - **過去分詞句**: divided into two different categories

**全文の日本語訳:**
テンプレートには9つのタイプがあり、2つの異なるカテゴリに分けられます。

**部分的な日本語訳:**
- There are: ～がある（There構文）
- 9 types of templates: 9つのタイプのテンプレート
- divided into: ～に分けられた（過去分詞句）
- two different categories: 2つの異なるカテゴリ

**重要単語の解説:**
- **type**: タイプ。種類や分類。
- **divide**: 分ける。複数の部分に分割すること。
- **category**: カテゴリ。分類や区分。
- **different**: 異なる。別の、という意味。

**文法ポイント:**
- **There構文**: "There are"は、存在を表す構文。
- **過去分詞句による修飾**: "divided into two different categories"は過去分詞句で、"templates"を修飾している。

---

## 例題10

**英文:**
These templates _define_ work to be done, usually in a Container.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: These templates
  - **V (Verb)**: _define_
  - **O (Object)**: work to be done
    - **名詞**: work
    - **不定詞句**: to be done（名詞を修飾）
  - **副詞**: usually
  - **前置詞句**: in a Container

**全文の日本語訳:**
これらのテンプレートは、通常コンテナ内で実行される作業を定義します。

**部分的な日本語訳:**
- These templates: これらのテンプレート
- _define_: 定義する（強調）
- work: 作業
- to be done: 実行される（不定詞の受動態）
- usually: 通常
- in a Container: コンテナ内で

**重要単語の解説:**
- **work**: 作業。実行すべき処理やタスク。
- **done**: 実行された。過去分詞で、完了を表す。
- **usually**: 通常。一般的に、という意味。
- **container**: コンテナ。アプリケーションとその依存関係をパッケージ化した実行環境。

**文法ポイント:**
- **不定詞の受動態**: "to be done"は不定詞の受動態で、名詞"work"を修飾している。
- **副詞の位置**: "usually"は文全体を修飾する副詞。
- **前置詞句**: "in a Container"は、場所を表す前置詞句。

---

## 例題11

**英文:**
Perhaps the most common template type, it will schedule a Container.

**文構造:**
- **分詞構文**: Perhaps the most common template type（譲歩を表す）
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: it
  - **V (Verb)**: will schedule
  - **O (Object)**: a Container

**全文の日本語訳:**
おそらく最も一般的なテンプレートタイプで、コンテナをスケジュールします。

**部分的な日本語訳:**
- Perhaps: おそらく
- the most common template type: 最も一般的なテンプレートタイプ
- it: それは
- will schedule: スケジュールする（助動詞 + 動詞）
- a Container: コンテナ

**重要単語の解説:**
- **perhaps**: おそらく。推測を表す副詞。
- **common**: 一般的な。広く使われている、という意味。
- **schedule**: スケジュールする。実行のタイミングを決めること。

**文法ポイント:**
- **分詞構文**: "Perhaps the most common template type"は分詞構文で、譲歩を表している。
- **助動詞will**: "will schedule"は、未来や予定を表す助動詞will。

---

## 例題12

**英文:**
A steps template allows you to define your tasks in a series of steps.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: A steps template
  - **V (Verb)**: allows
  - **O (Object)**: you
  - **不定詞句**: to define your tasks in a series of steps（目的語の補語）

**全文の日本語訳:**
stepsテンプレートを使用すると、一連のステップでタスクを定義できます。

**部分的な日本語訳:**
- A steps template: stepsテンプレート
- allows: 可能にする
- you: あなたに（目的語）
- to define: 定義すること
- your tasks: あなたのタスク
- in a series of steps: 一連のステップで

**重要単語の解説:**
- **allow**: 可能にする。何かができるようにすること。
- **task**: タスク。実行すべき作業や処理の単位。
- **series**: シリーズ。順序付けられた連続。
- **step**: ステップ。処理の1つの段階や手順。

**文法ポイント:**
- **allow + 目的語 + 不定詞**: "allow you to define"は、「あなたが定義することを可能にする」という意味。
- **前置詞句**: "in a series of steps"は、方法を表す前置詞句。

---

## 例題13

**英文:**
A dag template allows you to define your tasks as a graph of dependencies.

**文構造:**
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: A dag template
  - **V (Verb)**: allows
  - **O (Object)**: you
  - **不定詞句**: to define your tasks as a graph of dependencies（目的語の補語）

**全文の日本語訳:**
dagテンプレートを使用すると、依存関係のグラフとしてタスクを定義できます。

**部分的な日本語訳:**
- A dag template: dagテンプレート
- allows: 可能にする
- you: あなたに（目的語）
- to define: 定義すること
- your tasks: あなたのタスク
- as a graph of dependencies: 依存関係のグラフとして

**重要単語の解説:**
- **dag**: Directed Acyclic Graphの略。有向非巡回グラフ。
- **graph**: グラフ。ノードとエッジで構成されるデータ構造。
- **dependency**: 依存関係。あるタスクが他のタスクの完了を待つ関係。

**文法ポイント:**
- **allow + 目的語 + 不定詞**: "allow you to define"は、「あなたが定義することを可能にする」という意味。
- **前置詞句**: "as a graph of dependencies"は、方法や形式を表す前置詞句。

---

## 例題14

**英文:**
In a DAG, you list all your tasks and set which other tasks must complete before a particular task can begin.

**文構造:**
- **前置詞句**: In a DAG（場所を表す）
- **SVO構造** (Subject + Verb + Object)
  - **S (Subject)**: you
  - **V1 (Verb)**: list
  - **O1 (Object)**: all your tasks
  - **接続詞**: and
  - **V2 (Verb)**: set
  - **O2 (Object)**: which other tasks must complete before a particular task can begin
    - **名詞節**: which other tasks must complete
    - **従属節**: before a particular task can begin

**全文の日本語訳:**
DAGでは、すべてのタスクをリストアップし、特定のタスクが開始する前に完了しなければならない他のタスクを設定します。

**部分的な日本語訳:**
- In a DAG: DAGでは
- you: あなたは
- list: リストアップする
- all your tasks: すべてのタスク
- and: そして
- set: 設定する
- which other tasks: どの他のタスク（名詞節）
- must complete: 完了しなければならない
- before: ～の前に
- a particular task: 特定のタスク
- can begin: 開始できる

**重要単語の解説:**
- **list**: リストアップする。複数の項目を列挙すること。
- **set**: 設定する。値を決定すること。
- **complete**: 完了する。終了すること。
- **particular**: 特定の。ある特定の、という意味。
- **begin**: 開始する。始めること。

**文法ポイント:**
- **前置詞句**: "In a DAG"は、場所を表す前置詞句。
- **andによる並列**: "list...and set"は、andで接続された2つの動詞句。
- **名詞節**: "which other tasks must complete"は名詞節で、動詞"set"の目的語として機能している。
- **before節**: "before a particular task can begin"は、時間を表す従属節。

---

## 例題15

**英文:**
Tasks without any dependencies will be run immediately.

**文構造:**
- **受動態** (Passive Voice)
  - **S (Subject)**: Tasks without any dependencies
    - **名詞**: Tasks
    - **前置詞句**: without any dependencies
  - **V (Verb)**: will be run
  - **副詞**: immediately

**全文の日本語訳:**
依存関係のないタスクは、すぐに実行されます。

**部分的な日本語訳:**
- Tasks: タスク（複数形）
- without any dependencies: 依存関係のない
- will be run: 実行される（助動詞 + 受動態）
- immediately: すぐに

**重要単語の解説:**
- **without**: ～なしに。～がない、という意味。
- **any**: 任意の。どのような、という意味。
- **immediately**: すぐに。即座に、という意味。

**文法ポイント:**
- **前置詞句による修飾**: "without any dependencies"は、"Tasks"を修飾する前置詞句。
- **助動詞 + 受動態**: "will be run"は、助動詞と受動態の組み合わせで、「実行される」という意味。
- **副詞**: "immediately"は、動詞句を修飾する副詞。

---

## 例題16: 関係代名詞と条件文を含む複雑な文

**英文:**
When a workflow is created, Argo Workflows will create a Pod for each step that needs to be executed, which will run the container image specified in the template.

**文構造:**
- **時間の副詞節** + **主節** + **非制限用法の関係代名詞節**
  - **時間の副詞節**: When a workflow is created
    - **S**: a workflow
    - **V**: is created（受動態）
  - **主節**: Argo Workflows will create a Pod for each step that needs to be executed
    - **S**: Argo Workflows
    - **V**: will create
    - **O**: a Pod
    - **前置詞句**: for each step that needs to be executed
      - **関係代名詞節**: that needs to be executed
        - **S**: that (= step)
        - **V**: needs
        - **不定詞句**: to be executed
  - **非制限用法の関係代名詞節**: which will run the container image specified in the template
    - **関係代名詞**: which (Podを先行詞とする)
    - **V**: will run
    - **O**: the container image specified in the template
      - **過去分詞句**: specified in the template

**全文の日本語訳:**
ワークフローが作成されると、Argo Workflowsは実行される必要がある各ステップに対してPodを作成します。これは、テンプレートで指定されたコンテナイメージを実行します。

**部分的な日本語訳:**
- When: ～のとき
- a workflow: ワークフロー
- is created: 作成される（受動態）
- Argo Workflows: Argo Workflows
- will create: 作成するでしょう
- a Pod: Pod
- for each step: 各ステップに対して
- that needs: 必要とする（関係代名詞）
- to be executed: 実行されること
- which: それは（関係代名詞）
- will run: 実行するでしょう
- the container image: コンテナイメージ
- specified: 指定された
- in the template: テンプレートで

**重要単語の解説:**
- **create**: 作成する。新しいものを生成すること。
- **Pod**: Pod。Kubernetesの最小実行単位。
- **step**: ステップ。処理の1つの段階。
- **need**: 必要とする。何かが必要であること。
- **container image**: コンテナイメージ。コンテナを実行するためのイメージ。
- **specify**: 指定する。明確に示すこと。spec-（見る）+ -ify（動詞化）から成る。

**文法ポイント:**
- **時間の副詞節**: "When"で始まる節が、主節の動作が起こるタイミングを表している。
- **関係代名詞節**: "that needs to be executed"は制限用法の関係代名詞節で、"step"を修飾している。
- **非制限用法の関係代名詞**: "which"は非制限用法で、追加情報を提供している。
- **過去分詞による修飾**: "specified in the template"は過去分詞句で、"container image"を修飾している。

---

## 例題17: 複雑な条件文と結果

**英文:**
If a step fails, the workflow can be configured to either retry the failed step or terminate the entire workflow, depending on the retry strategy that you have defined.

**文構造:**
- **条件の副詞節** + **主節** + **分詞構文**
  - **条件の副詞節**: If a step fails
    - **S**: a step
    - **V**: fails
  - **主節**: the workflow can be configured to either retry the failed step or terminate the entire workflow
    - **S**: the workflow
    - **V**: can be configured（受動態）
    - **不定詞句**: to either retry the failed step or terminate the entire workflow
      - **不定詞1**: to retry the failed step
        - **動詞**: retry
        - **O**: the failed step
      - **等位接続詞**: or
      - **不定詞2**: terminate the entire workflow
        - **動詞**: terminate
        - **O**: the entire workflow
  - **分詞構文**: depending on the retry strategy that you have defined
    - **前置詞句**: on the retry strategy that you have defined
      - **関係代名詞節**: that you have defined
        - **S**: you
        - **V**: have defined（現在完了）

**全文の日本語訳:**
ステップが失敗した場合、定義したリトライ戦略に応じて、ワークフローは失敗したステップをリトライするか、ワークフロー全体を終了するように設定できます。

**部分的な日本語訳:**
- If: もし～なら
- a step: ステップ
- fails: 失敗する
- the workflow: ワークフロー
- can be configured: 設定できる（受動態）
- to either retry: リトライするか
- the failed step: 失敗したステップ
- or: または
- terminate: 終了する
- the entire workflow: ワークフロー全体
- depending on: ～に応じて
- the retry strategy: リトライ戦略
- that you have defined: あなたが定義した（関係代名詞節）

**重要単語の解説:**
- **fail**: 失敗する。期待される動作を実行できないこと。
- **configure**: 設定する。システムやソフトウェアを設定すること。con-（共に）+ figure（形作る）から成る。
- **retry**: リトライする。再試行すること。re-（再び）+ try（試す）から成る。
- **terminate**: 終了する。処理を終了させること。
- **entire**: 全体の。全ての、という意味。
- **strategy**: 戦略。計画や方針。

**文法ポイント:**
- **条件の副詞節**: "If"で始まる節が、主節の動作が起こる条件を表している。
- **受動態**: "can be configured"は受動態。
- **either...or**: "either...or"が2つの選択肢を表している。
- **関係代名詞節**: "that you have defined"は関係代名詞節で、"strategy"を修飾している。
- **現在完了**: "have defined"は現在完了で、完了した動作を表している。

---

## 例題18: 関係代名詞と目的語節を含む複雑な文

**英文:**
The workflow controller, which is responsible for managing workflow execution, monitors the status of each Pod that is created and updates the workflow status accordingly.

**文構造:**
- **SVO構造** + **非制限用法の関係代名詞節** + **関係代名詞節**
  - **S**: The workflow controller
  - **非制限用法の関係代名詞節**: which is responsible for managing workflow execution
    - **関係代名詞**: which (controllerを先行詞とする)
    - **V**: is
    - **C**: responsible
    - **前置詞句**: for managing workflow execution
      - **動名詞句**: managing workflow execution
  - **V**: monitors
  - **O1**: the status of each Pod that is created
    - **名詞句**: the status
    - **前置詞句**: of each Pod that is created
      - **関係代名詞節**: that is created
        - **S**: that (= Pod)
        - **V**: is created（受動態）
  - **等位接続詞**: and
  - **V2**: updates
  - **O2**: the workflow status
  - **副詞**: accordingly

**全文の日本語訳:**
ワークフロー実行の管理を担当するワークフローコントローラーは、作成された各Podのステータスを監視し、それに応じてワークフローのステータスを更新します。

**部分的な日本語訳:**
- The workflow controller: ワークフローコントローラー
- which: それは（関係代名詞）
- is responsible: 責任がある
- for managing: 管理することに対して
- workflow execution: ワークフロー実行
- monitors: 監視する
- the status: ステータス
- of each Pod: 各Podの
- that is created: 作成された（関係代名詞節）
- and: そして
- updates: 更新する
- the workflow status: ワークフローのステータス
- accordingly: それに応じて

**重要単語の解説:**
- **controller**: コントローラー。システムを制御するコンポーネント。
- **responsible**: 責任がある。役割を担っていること。re-（再び）+ spond（応答する）+ -ible（可能な）から成る。
- **manage**: 管理する。制御や処理を行うこと。
- **execution**: 実行。プログラムやタスクを実行すること。
- **monitor**: 監視する。状態を観察すること。
- **status**: ステータス。状態や状況。
- **accordingly**: それに応じて。適切に、という意味。

**文法ポイント:**
- **非制限用法の関係代名詞**: "which"は非制限用法で、追加情報を提供している。
- **動名詞**: "managing"は動名詞で、前置詞"for"の目的語として機能している。
- **関係代名詞節**: "that is created"は関係代名詞節で、"Pod"を修飾している。
- **等位接続詞**: "and"が2つの動詞を結んでいる。

---

## 例題19: 複雑な目的と手段の表現

**英文:**
To pass data between steps, you can use artifacts, which are files that are stored in a shared storage location and can be accessed by any step that needs them.

**文構造:**
- **不定詞句** + **SVO構造** + **非制限用法の関係代名詞節**
  - **不定詞句**: To pass data between steps（目的を表す副詞的用法）
    - **動詞**: pass
    - **O**: data
    - **前置詞句**: between steps
  - **主節**: you can use artifacts
    - **S**: you
    - **V**: can use
    - **O**: artifacts
  - **非制限用法の関係代名詞節**: which are files that are stored in a shared storage location and can be accessed by any step that needs them
    - **関係代名詞**: which (artifactsを先行詞とする)
    - **V**: are
    - **C**: files
      - **関係代名詞節**: that are stored in a shared storage location and can be accessed by any step that needs them
        - **V1**: are stored（受動態）
        - **前置詞句**: in a shared storage location
        - **等位接続詞**: and
        - **V2**: can be accessed（受動態）
        - **前置詞句**: by any step that needs them
          - **関係代名詞節**: that needs them
            - **S**: that (= step)
            - **V**: needs
            - **O**: them

**全文の日本語訳:**
ステップ間でデータを渡すために、アーティファクトを使用できます。アーティファクトは、共有ストレージ場所に保存され、それらを必要とする任意のステップからアクセスできるファイルです。

**部分的な日本語訳:**
- To pass: 渡すために
- data: データ
- between steps: ステップ間で
- you can use: あなたは使用できます
- artifacts: アーティファクト
- which: それらは（関係代名詞）
- are: ～である
- files: ファイル
- that are stored: 保存されている（関係代名詞節）
- in a shared storage location: 共有ストレージ場所に
- and: そして
- can be accessed: アクセスできる（受動態）
- by any step: 任意のステップによって
- that needs them: それらを必要とする（関係代名詞節）

**重要単語の解説:**
- **pass**: 渡す。データや情報を伝えること。
- **artifact**: アーティファクト。ビルドや処理で生成される成果物。
- **store**: 保存する。データを保管すること。
- **shared**: 共有された。複数のものが共有する、という意味。
- **storage**: ストレージ。データの保存場所。
- **location**: 場所。位置や所在地。
- **access**: アクセスする。リソースにアクセスすること。

**文法ポイント:**
- **不定詞の副詞的用法**: "To pass data between steps"は目的を表す副詞的用法。
- **非制限用法の関係代名詞**: "which"は非制限用法で、追加情報を提供している。
- **関係代名詞節の入れ子**: "that are stored"と"that needs them"が入れ子になっている。
- **受動態**: "are stored"と"can be accessed"は受動態。

---

## 例題20: 複雑な条件と結果の表現

**英文:**
Although workflows are typically defined using YAML files, you can also create and manage them programmatically through the Kubernetes API, which provides a flexible way to integrate workflows into your applications.

**文構造:**
- **譲歩の副詞節** + **主節** + **非制限用法の関係代名詞節**
  - **譲歩の副詞節**: Although workflows are typically defined using YAML files
    - **S**: workflows
    - **V**: are defined（受動態）
    - **副詞**: typically
    - **分詞構文**: using YAML files
  - **主節**: you can also create and manage them programmatically through the Kubernetes API
    - **S**: you
    - **V1**: can create
    - **等位接続詞**: and
    - **V2**: manage
    - **O**: them
    - **副詞**: programmatically
    - **前置詞句**: through the Kubernetes API
  - **非制限用法の関係代名詞節**: which provides a flexible way to integrate workflows into your applications
    - **関係代名詞**: which (Kubernetes APIを先行詞とする)
    - **V**: provides
    - **O**: a flexible way to integrate workflows into your applications
      - **名詞句**: a flexible way
      - **不定詞句**: to integrate workflows into your applications
        - **動詞**: integrate
        - **O**: workflows
        - **前置詞句**: into your applications

**全文の日本語訳:**
ワークフローは通常YAMLファイルを使用して定義されますが、Kubernetes APIを通じてプログラム的に作成・管理することもできます。これにより、ワークフローをアプリケーションに統合する柔軟な方法が提供されます。

**部分的な日本語訳:**
- Although: ～にもかかわらず
- workflows: ワークフロー
- are typically defined: 通常定義される（受動態）
- using YAML files: YAMLファイルを使用して
- you can also create: あなたはまた作成できます
- and: そして
- manage: 管理する
- them: それら（ワークフロー）
- programmatically: プログラム的に
- through: ～を通じて
- the Kubernetes API: Kubernetes API
- which: それは（関係代名詞）
- provides: 提供する
- a flexible way: 柔軟な方法
- to integrate: 統合すること
- workflows: ワークフロー
- into your applications: あなたのアプリケーションに

**重要単語の解説:**
- **although**: ～にもかかわらず。譲歩を表す接続詞。
- **typically**: 通常。一般的に、という意味。
- **programmatically**: プログラム的に。コードを使用して、という意味。
- **through**: ～を通じて。手段を表す前置詞。
- **provide**: 提供する。何かを与えること。pro-（前へ）+ vide（見る）から成る。
- **flexible**: 柔軟な。適応性がある、という意味。
- **integrate**: 統合する。複数のものを一つにまとめること。

**文法ポイント:**
- **譲歩の副詞節**: "Although"で始まる節が、主節と対比される情報を表している。
- **分詞構文**: "using YAML files"は分詞構文で、方法を表している。
- **等位接続詞**: "and"が2つの動詞を結んでいる。
- **非制限用法の関係代名詞**: "which"は非制限用法で、追加情報を提供している。
- **不定詞の形容詞的用法**: "to integrate"は不定詞の形容詞的用法で、"way"を修飾している。

---

