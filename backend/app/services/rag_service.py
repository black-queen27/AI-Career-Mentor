from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.Client()

collection = client.get_or_create_collection(
    name="resume_chunks"
)


# ---------------------------------------
# Store Resume Chunks
# ---------------------------------------
def store_resume_chunks(
    firebase_uid,
    resume_text
):
    try:

        chunks = [
            resume_text[i:i + 500]
            for i in range(
                0,
                len(resume_text),
                500
            )
        ]

        embeddings = model.encode(
            chunks
        ).tolist()

        for idx, chunk in enumerate(chunks):

            collection.add(
                ids=[
                    f"{firebase_uid}_{idx}"
                ],

                embeddings=[
                    embeddings[idx]
                ],

                documents=[
                    chunk
                ],

                metadatas=[
                    {
                        "firebase_uid":
                        firebase_uid
                    }
                ]
            )

        print(
            f"Stored {len(chunks)} chunks "
            f"for {firebase_uid}"
        )

    except Exception as e:

        print(
            "RAG STORE ERROR:",
            e
        )


# ---------------------------------------
# Retrieve Resume Context
# ---------------------------------------
def retrieve_context(
    firebase_uid,
    query
):
    try:

        query_embedding = model.encode(
            query
        ).tolist()

        results = collection.query(
            query_embeddings=[
                query_embedding
            ],

            n_results=3,

            where={
                "firebase_uid":
                firebase_uid
            }
        )

        documents = results.get(
            "documents",
            [[]]
        )[0]

        if not documents:
            return ""

        return "\n".join(
            documents
        )

    except Exception as e:

        print(
            "RAG RETRIEVE ERROR:",
            e
        )

        return ""