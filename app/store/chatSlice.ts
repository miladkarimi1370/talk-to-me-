import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";


type Tchat = {
    id: string;
    content: string;
    conversation_id: string;
    role: string,
    created_at: string
}
const chatAdapter = createEntityAdapter<Tchat>({
    sortComparer: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
})



type chatState = {
    loading: boolean,
    error: string | null
} & ReturnType<typeof chatAdapter.getInitialState>

const initialState: chatState = chatAdapter.getInitialState({
    loading: false,
    error: null
})


export const fetchMessages = createAsyncThunk<Tchat[], { content?: string }>(
    "chat/fetchMessages", async ({ content }, thunkApi) => {
        try {
            const url = content || content?.trim()

                ? "/api/chat/message?content=" + encodeURIComponent(content)
                : "/api/chat/message";

            const res = await fetch(url);
            if (!res.ok) {
                return thunkApi.rejectWithValue(await res.text());
            }

            return (await res.json()) as Tchat[];

        } catch (err) {
            return thunkApi.rejectWithValue("خطای شبکه");
        }
    }
)

export const chatNewMessage = createAsyncThunk<Tchat, { content: string, conversation_id: string, role: string }>(
    "chat/newMessage", async ({ content, conversation_id, role }, thunkApi) => {
        try {
            const res = await fetch("/api/chat/message", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    conversation_id,  
                    role
                }),
                headers: {
                    "content-type": "application/json"
                }
            });
            if (!res.ok) {
                return thunkApi.rejectWithValue(await res.text());
            }

            return await res.json() as Tchat
        } catch (err) {
            return thunkApi.rejectWithValue("خطای شبکه");
        }
    }
)


export const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(chatNewMessage.pending, (state) => {
            state.loading = true
        })
            .addCase(chatNewMessage.rejected, (state, action) => {
                state.error = action.payload as string || "حطای ناشناخته";
                state.loading = false
            })
            .addCase(chatNewMessage.fulfilled, (state, action) => {
                chatAdapter.addOne(state, action.payload);
                state.loading = false;
            }),

            builder.addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null
            })
                .addCase(fetchMessages.rejected, (state, action) => {
                    state.error = action.payload as string || "خطای ناشناخته در دریافت همه ی کامنت ها "
                })
                .addCase(fetchMessages.fulfilled, (state, action) => {
                    chatAdapter.setAll(state, action.payload);
                    state.loading = false
                })


    },

})

export const { selectAll: selectAllMessages, selectById: selectMessageById } = chatAdapter.getSelectors((state: RootState) => state.chat)

export default chatSlice.reducer

