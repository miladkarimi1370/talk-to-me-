import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"

type Tconversation = {
    id: string,
    title: string,
    user_id: string,
    is_favorite: boolean,
    created_at: string,
    updated_at: string
}

const conversationAdapter = createEntityAdapter<Tconversation>({
    sortComparer: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
})


type conversationState = {
    loading: boolean,
    error: string | null
} & ReturnType<typeof conversationAdapter.getInitialState>


const initialState: conversationState = conversationAdapter.getInitialState({
    loading: false,
    error: null
})


export const fetchConversation = createAsyncThunk<Tconversation[], { content?: string }>("conversation/fetchConversation", async ({ content }, thunkApi) => {
    try {
        const url = content && content?.trim()
            ? "/api/conversation?content=" + content + ""
            : "/api/conversation";

        const res = await fetch(url);

        if (!res.ok) return thunkApi.rejectWithValue(await res.text())

        return await res.json() as Tconversation[]

    } catch (error) {
        return thunkApi.rejectWithValue("خطای شبکه")
    }
})

export const setNewConversation = createAsyncThunk<Tconversation, { title: string }>
    ("conversation/newConversation", async ({ title }, thunkApi) => {
        try {
            const res = await fetch("/api/conversation/", {
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    title
                })
            })

            if (!res.ok) {
                return thunkApi.rejectWithValue(await res.text() as string || "خطای ناشناخته")
            }

            return await res.json() as Tconversation;
        } catch (err) {
            return thunkApi.rejectWithValue("خطای شبکه")
        }
    })


export const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchConversation.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(fetchConversation.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload as string || "خطای ناشناخته"
            })
            .addCase(fetchConversation.fulfilled, (state, action) => {
                conversationAdapter.setAll(state, action.payload);
                state.loading = false
            }),
            builder.addCase(setNewConversation.pending, (state) => {
                state.loading = true;
                state.error = null
            })
                .addCase(setNewConversation.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "خطای ناشناخته"
                })
                .addCase(setNewConversation.fulfilled, (state, action) => {
                    conversationAdapter.addOne(state, action.payload)
                })
    },
})

export const { selectAll: allConversations, selectById: conversationById } = conversationAdapter.getSelectors((state: any) => state.conversation)
export default conversationSlice.reducer