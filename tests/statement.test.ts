import {down, up} from '../src/migrations/001_initial_schema'
import {dbClient} from '../src/db/client'
import {startApp} from "../src/app";
import request from 'supertest';

describe('statement flow', () => {
	jest.setTimeout(20000)

	beforeEach(async () => {
		await down(dbClient)
		await up(dbClient)
	})

	it('create statement', async () => {
		const app = await startApp();

		const authResponse = await request(app.callback())
			.post('/user/mock-auth')
			.send({
				'address': '0x4eF7350A35226F683FA78989aaEeE1203E485Ad4'
			})
			.expect(200);

		await request(app.callback())
			.post('/statement')
			.set('Authorization', authResponse.body.jwt)
			.send({
				"name": "arithmetic_example",
				"description": "description",
				"url": "url",
				"inputDescription": "input_description",
				"type": "placeholder-zkllvm",
				"isPrivate": false,
				"definition": {
					"verificationKey": "verification_key",
					"provingKey": "; ModuleID = 'llvm-link'\nsource_filename = \"llvm-link\"\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\ntarget triple = \"assigner\"\n\n$_ZN3nil7crypto37algebra6fields17pallas_base_field12modulus_bitsE = comdat any\n\n$_ZN3nil7crypto37algebra6fields17pallas_base_field11number_bitsE = comdat any\n\n$_ZN3nil7crypto37algebra6fields17pallas_base_field10value_bitsE = comdat any\n\n$_ZN3nil7crypto37algebra6fields16vesta_base_field12modulus_bitsE = comdat any\n\n$_ZN3nil7crypto37algebra6fields16vesta_base_field11number_bitsE = comdat any\n\n$_ZN3nil7crypto37algebra6fields16vesta_base_field10value_bitsE = comdat any\n\n@_ZZN3nil7crypto314multiprecision8backends11window_bitsEmE5wsize = internal unnamed_addr constant [6 x [2 x i64]] [[2 x i64] [i64 1434, i64 7], [2 x i64] [i64 539, i64 6], [2 x i64] [i64 197, i64 4], [2 x i64] [i64 70, i64 3], [2 x i64] [i64 17, i64 2], [2 x i64] zeroinitializer], align 8\n@_ZN3nil7crypto37algebra6fields17pallas_base_field12modulus_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n@_ZN3nil7crypto37algebra6fields17pallas_base_field11number_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n@_ZN3nil7crypto37algebra6fields17pallas_base_field10value_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n@_ZN3nil7crypto37algebra6fields16vesta_base_field12modulus_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n@_ZN3nil7crypto37algebra6fields16vesta_base_field11number_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n@_ZN3nil7crypto37algebra6fields16vesta_base_field10value_bitsE = weak_odr dso_local local_unnamed_addr constant i64 255, comdat, align 8\n\n; Function Attrs: mustprogress nounwind\ndefine dso_local void @free(i8* noundef %0) local_unnamed_addr #0 {\n  tail call void @llvm.assigner.free(i8* %0)\n  ret void\n}\n\n; Function Attrs: nounwind\ndeclare void @llvm.assigner.free(i8*) #1\n\n; Function Attrs: mustprogress nounwind allocsize(0)\ndefine dso_local i8* @malloc(i64 noundef %0) local_unnamed_addr #2 {\n  %2 = tail call i8* @llvm.assigner.malloc(i64 %0)\n  ret i8* %2\n}\n\n; Function Attrs: nounwind\ndeclare i8* @llvm.assigner.malloc(i64) #1\n\n; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(none)\ndefine dso_local noundef i64 @_ZN3nil7crypto314multiprecision8backends11window_bitsEm(i64 noundef %0) local_unnamed_addr #3 {\n  br label %2\n\n2:                                                ; preds = %2, %1\n  %3 = phi i64 [ 5, %1 ], [ %8, %2 ]\n  %4 = getelementptr inbounds [6 x [2 x i64]], [6 x [2 x i64]]* @_ZZN3nil7crypto314multiprecision8backends11window_bitsEmE5wsize, i64 0, i64 %3\n  %5 = getelementptr inbounds [2 x i64], [2 x i64]* %4, i64 0, i64 0\n  %6 = load i64, i64* %5, align 8, !tbaa !3\n  %7 = icmp ugt i64 %6, %0\n  %8 = add i64 %3, -1\n  br i1 %7, label %2, label %9, !llvm.loop !7\n\n9:                                                ; preds = %2\n  %10 = getelementptr inbounds [2 x i64], [2 x i64]* %4, i64 0, i64 1\n  %11 = load i64, i64* %10, align 8, !tbaa !3\n  %12 = add i64 1, %11\n  ret i64 %12\n}\n\n; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(none)\ndefine dso_local noundef __zkllvm_field_pallas_base @_Z3powu26__zkllvm_field_pallas_basei(__zkllvm_field_pallas_base noundef %0, i32 noundef %1) local_unnamed_addr #3 {\n  %3 = icmp slt i32 0, %1\n  br i1 %3, label %4, label %10\n\n4:                                                ; preds = %4, %2\n  %5 = phi i32 [ %8, %4 ], [ 0, %2 ]\n  %6 = phi __zkllvm_field_pallas_base [ %7, %4 ], [ f0x1, %2 ]\n  %7 = mul __zkllvm_field_pallas_base %6, %0\n  %8 = add nuw nsw i32 %5, 1\n  %9 = icmp ne i32 %8, %1\n  br i1 %9, label %4, label %10, !llvm.loop !10\n\n10:                                               ; preds = %4, %2\n  %11 = phi __zkllvm_field_pallas_base [ f0x1, %2 ], [ %7, %4 ]\n  ret __zkllvm_field_pallas_base %11\n}\n\n; Function Attrs: circuit mustprogress nofree norecurse nosync nounwind willreturn memory(none)\ndefine dso_local noundef __zkllvm_field_pallas_base @_Z24field_arithmetic_exampleu26__zkllvm_field_pallas_baseu26__zkllvm_field_pallas_base(__zkllvm_field_pallas_base noundef %0, __zkllvm_field_pallas_base noundef %1) local_unnamed_addr #4 {\n  %3 = add __zkllvm_field_pallas_base %0, %1\n  %4 = mul __zkllvm_field_pallas_base %3, %0\n  %5 = mul __zkllvm_field_pallas_base %1, %3\n  %6 = mul __zkllvm_field_pallas_base %5, %3\n  %7 = add __zkllvm_field_pallas_base %4, %6\n  %8 = mul __zkllvm_field_pallas_base %7, %7\n  %9 = sub __zkllvm_field_pallas_base %1, %0\n  br label %10\n\n10:                                               ; preds = %10, %2\n  %11 = phi i32 [ %14, %10 ], [ 0, %2 ]\n  %12 = phi __zkllvm_field_pallas_base [ %13, %10 ], [ f0x1, %2 ]\n  %13 = mul __zkllvm_field_pallas_base %12, %0\n  %14 = add nuw nsw i32 %11, 1\n  %15 = icmp ne i32 %14, 2\n  br i1 %15, label %10, label %16, !llvm.loop !10\n\n16:                                               ; preds = %10\n  %17 = mul __zkllvm_field_pallas_base %8, %7\n  %18 = sdiv __zkllvm_field_pallas_base %17, %9\n  %19 = add __zkllvm_field_pallas_base %18, %13\n  %20 = add __zkllvm_field_pallas_base %19, f0x12345678901234567890\n  ret __zkllvm_field_pallas_base %20\n}\n\nattributes #0 = { mustprogress nounwind \"frame-pointer\"=\"all\" \"no-trapping-math\"=\"true\" \"stack-protector-buffer-size\"=\"8\" }\nattributes #1 = { nounwind }\nattributes #2 = { mustprogress nounwind allocsize(0) \"frame-pointer\"=\"all\" \"no-trapping-math\"=\"true\" \"stack-protector-buffer-size\"=\"8\" }\nattributes #3 = { mustprogress nofree norecurse nosync nounwind willreturn memory(none) \"frame-pointer\"=\"all\" \"no-trapping-math\"=\"true\" \"stack-protector-buffer-size\"=\"8\" }\nattributes #4 = { circuit mustprogress nofree norecurse nosync nounwind willreturn memory(none) \"frame-pointer\"=\"all\" \"no-trapping-math\"=\"true\" \"stack-protector-buffer-size\"=\"8\" }\n\n!llvm.linker.options = !{}\n!llvm.ident = !{!0}\n!llvm.module.flags = !{!1, !2}\n\n!0 = !{!\"clang version 16.0.0 (https://github.com/NilFoundation/zkllvm-circifier.git 158b3390eb47c037f43d07e82b5a9b0cc8397489)\"}\n!1 = !{i32 1, !\"wchar_size\", i32 4}\n!2 = !{i32 7, !\"frame-pointer\", i32 2}\n!3 = !{!4, !4, i64 0}\n!4 = !{!\"long\", !5, i64 0}\n!5 = !{!\"omnipotent char\", !6, i64 0}\n!6 = !{!\"Simple C++ TBAA\"}\n!7 = distinct !{!7, !8, !9}\n!8 = !{!\"llvm.loop.mustprogress\"}\n!9 = !{!\"llvm.loop.unroll.disable\"}\n!10 = distinct !{!10, !8, !9}\n"
				}
			})
			.expect(200)

		const statementsResponse = await request(app.callback())
			.get('/statement')
			.set('Authorization', authResponse.body.jwt)
			.send()
			.expect(200);

		expect(statementsResponse.body).toHaveLength(1)
	})
})