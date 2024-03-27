
# make -f /workspace/vscode-bash-debug/bashdb_dir/makefiledb.mk target-recipe-2 input_file=/workspace/vscode-bash-debug/test/Makefile
FILE=$(input_file)

target-recipe-1:
	echo "Hello"


target-recipe-2:
	echo $(FILE)
	make -f $(FILE) target-recipe-1